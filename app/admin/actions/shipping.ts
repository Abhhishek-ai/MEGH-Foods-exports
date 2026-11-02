'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { requireAdmin } from '@/lib/admin-auth'

const zoneSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(2, 'Name is required'),
  country_codes: z.array(z.string().trim().toUpperCase()).default([]),
  rate_inr: z.coerce.number().nonnegative(),
  rate_usd: z.coerce.number().nonnegative(),
  free_above_inr: z.coerce.number().nonnegative().nullable().optional(),
  free_above_usd: z.coerce.number().nonnegative().nullable().optional(),
  est_days: z.string().trim().nullable().optional(),
  is_default: z.boolean().default(false),
  is_active: z.boolean().default(true),
})

export async function saveShippingZone(input: unknown) {
  try {
    const supabase = await requireAdmin()
    const parsed = zoneSchema.safeParse(input)
    if (!parsed.success) {
      return { ok: false as const, error: 'Please check the shipping zone values.' }
    }

    const { id, ...data } = parsed.data

    // If this zone is being set as default, ensure it is active
    if (data.is_default && !data.is_active) {
      return { ok: false as const, error: 'Default shipping zone must be active.' }
    }

    // If setting this zone as default, unset is_default on other zones
    if (data.is_default) {
      await supabase.from('shipping_zones').update({ is_default: false }).neq('id', id || '00000000-0000-0000-0000-000000000000')
    }

    const res = id
      ? await supabase.from('shipping_zones').update(data).eq('id', id).select('id').single()
      : await supabase.from('shipping_zones').insert(data).select('id').single()

    if (res.error) return { ok: false as const, error: res.error.message }

    // Validate that at least and at most one active zone is is_default
    const { data: defaultZones } = await supabase
      .from('shipping_zones')
      .select('id')
      .eq('is_active', true)
      .eq('is_default', true)

    if (!defaultZones || defaultZones.length === 0) {
      // Auto-assign this or another active zone as default
      await supabase.from('shipping_zones').update({ is_default: true }).eq('id', res.data.id)
    }

    revalidatePath('/admin/shipping')
    return { ok: true as const, id: res.data.id }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to save shipping zone'
    return { ok: false as const, error: message }
  }
}

export async function toggleShippingZoneActive(id: string, is_active: boolean) {
  try {
    const supabase = await requireAdmin()
    const { data: zone } = await supabase.from('shipping_zones').select('is_default').eq('id', id).single()

    if (zone?.is_default && !is_active) {
      return { ok: false as const, error: 'Cannot deactivate the default shipping zone. Assign another default first.' }
    }

    const { error } = await supabase.from('shipping_zones').update({ is_active }).eq('id', id)
    if (error) return { ok: false as const, error: error.message }

    revalidatePath('/admin/shipping')
    return { ok: true as const }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to toggle zone'
    return { ok: false as const, error: message }
  }
}

export async function deleteShippingZone(id: string) {
  try {
    const supabase = await requireAdmin()
    const { data: zone } = await supabase.from('shipping_zones').select('is_default').eq('id', id).single()
    if (zone?.is_default) {
      return { ok: false as const, error: 'Cannot delete the default shipping zone. Set another zone as default first.' }
    }

    const { error } = await supabase.from('shipping_zones').delete().eq('id', id)
    if (error) return { ok: false as const, error: error.message }

    revalidatePath('/admin/shipping')
    return { ok: true as const }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to delete zone'
    return { ok: false as const, error: message }
  }
}
