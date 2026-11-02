import 'server-only'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function requireAdmin() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  const { data: ok } = await supabase.rpc('is_admin')
  if (!ok) throw new Error('Forbidden')
  return supabase
}

export function revalidateCatalog() {
  revalidatePath('/')
  revalidatePath('/products')
  revalidatePath('/products/[slug]', 'page')
  revalidatePath('/category/[slug]', 'page')
  revalidatePath('/sitemap.xml')
}
