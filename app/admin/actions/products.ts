'use server'

import { requireAdmin, revalidateCatalog } from '@/lib/admin-auth'
import { productSchema } from '@/lib/validation/product'

export async function saveProduct(input: unknown) {
  try {
    const supabase = await requireAdmin()
    const parsed = productSchema.safeParse(input)
    if (!parsed.success) {
      return {
        ok: false as const,
        error: 'Please fix the highlighted fields.',
        fields: parsed.error.flatten().fieldErrors,
      }
    }

    const { variants, id, ...product } = parsed.data
    const res = id
      ? await supabase.from('products').update(product).eq('id', id).select('id').single()
      : await supabase.from('products').insert(product).select('id').single()

    if (res.error) {
      const msg = res.error.code === '23505' ? 'Slug or SKU already exists.' : res.error.message
      return { ok: false as const, error: msg }
    }
    const productId = res.data.id

    // Remove variants that were removed in the form
    const keepIds = variants.filter((v) => v.id).map((v) => v.id as string)
    let del = supabase.from('product_variants').delete().eq('product_id', productId)
    if (keepIds.length) del = del.not('id', 'in', `(${keepIds.join(',')})`)
    const { error: delErr } = await del
    if (delErr) return { ok: false as const, error: delErr.message }

    const existing = variants.filter((v) => v.id).map((v) => ({ ...v, product_id: productId }))
    const fresh = variants.filter((v) => !v.id).map(({ id: _id, ...v }) => ({ ...v, product_id: productId }))

    if (existing.length) {
      const { error } = await supabase.from('product_variants').upsert(existing, { onConflict: 'id' })
      if (error) {
        return {
          ok: false as const,
          error: error.code === '23505' ? 'A pack-size SKU already exists.' : error.message,
        }
      }
    }
    if (fresh.length) {
      const { error } = await supabase.from('product_variants').insert(fresh)
      if (error) {
        return {
          ok: false as const,
          error: error.code === '23505' ? 'A pack-size SKU already exists.' : error.message,
        }
      }
    }

    revalidateCatalog()
    return { ok: true as const, id: productId }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to save product'
    return { ok: false as const, error: message }
  }
}

const FLAGS = ['is_active', 'is_featured', 'is_b2b_only', 'is_new_arrival'] as const
export async function toggleProductFlag(id: string, flag: (typeof FLAGS)[number], value: boolean) {
  try {
    const supabase = await requireAdmin()
    if (!FLAGS.includes(flag)) return { ok: false as const, error: 'Invalid flag' }
    const { error } = await supabase.from('products').update({ [flag]: value }).eq('id', id)
    if (error) return { ok: false as const, error: error.message }
    revalidateCatalog()
    return { ok: true as const }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to toggle flag'
    return { ok: false as const, error: message }
  }
}

export async function deleteProduct(id: string) {
  try {
    const supabase = await requireAdmin()
    const { data: p } = await supabase.from('products').select('images').eq('id', id).single()
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) return { ok: false as const, error: error.message }

    const paths = (p?.images ?? [])
      .map((u: string) => u.split('/product-images/')[1])
      .filter(Boolean) as string[]
    if (paths.length) {
      await supabase.storage.from('product-images').remove(paths)
    }

    revalidateCatalog()
    return { ok: true as const }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to delete product'
    return { ok: false as const, error: message }
  }
}

export async function duplicateProduct(id: string) {
  try {
    const supabase = await requireAdmin()
    const { data: p, error } = await supabase
      .from('products')
      .select('*, product_variants(*)')
      .eq('id', id)
      .single()

    if (error || !p) return { ok: false as const, error: error?.message ?? 'Not found' }
    const suffix = Math.random().toString(36).slice(2, 6)
    const { product_variants, id: _id, created_at: _c, updated_at: _u, ...base } = p
    const { data: copy, error: e2 } = await supabase
      .from('products')
      .insert({
        ...base,
        title: `${p.title} (Copy)`,
        slug: `${p.slug}-copy-${suffix}`,
        sku: `${p.sku}-C${suffix}`,
        is_active: false,
      })
      .select('id')
      .single()

    if (e2 || !copy) return { ok: false as const, error: e2?.message ?? 'Duplicate failed' }

    if (product_variants?.length) {
      await supabase.from('product_variants').insert(
        product_variants.map(({ id: _vid, created_at: _vc, ...v }: Record<string, unknown>) => ({
          ...v,
          product_id: copy.id,
          sku: `${v.sku}-C${suffix}`,
        }))
      )
    }

    revalidateCatalog()
    return { ok: true as const, id: copy.id }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Duplicate failed'
    return { ok: false as const, error: message }
  }
}
