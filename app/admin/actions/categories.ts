'use server'

import { z } from 'zod'
import { requireAdmin, revalidateCatalog } from '@/lib/admin-auth'

const categorySchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(2, 'Name must be at least 2 characters'),
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Lowercase alphanumeric and hyphens only'),
  image_url: z.string().url().nullable().optional(),
  sort_order: z.coerce.number().int().default(0),
  is_active: z.boolean().default(true),
})

export async function saveCategory(input: unknown) {
  try {
    const supabase = await requireAdmin()
    const parsed = categorySchema.safeParse(input)
    if (!parsed.success) {
      return { ok: false as const, error: 'Please check the category inputs.' }
    }

    const { id, ...data } = parsed.data
    const res = id
      ? await supabase.from('categories').update(data).eq('id', id).select('id').single()
      : await supabase.from('categories').insert(data).select('id').single()

    if (res.error) {
      const msg = res.error.code === '23505' ? 'A category with this slug already exists.' : res.error.message
      return { ok: false as const, error: msg }
    }

    revalidateCatalog()
    return { ok: true as const, id: res.data.id }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to save category'
    return { ok: false as const, error: message }
  }
}

export async function toggleCategoryActive(id: string, is_active: boolean) {
  try {
    const supabase = await requireAdmin()
    const { error } = await supabase.from('categories').update({ is_active }).eq('id', id)
    if (error) return { ok: false as const, error: error.message }
    revalidateCatalog()
    return { ok: true as const }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to toggle category'
    return { ok: false as const, error: message }
  }
}

export async function deleteCategory(id: string) {
  try {
    const supabase = await requireAdmin()
    const { error } = await supabase.from('categories').delete().eq('id', id)
    if (error) return { ok: false as const, error: error.message }
    revalidateCatalog()
    return { ok: true as const }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to delete category'
    return { ok: false as const, error: message }
  }
}
