import { createAdminClient } from '@/lib/supabase/admin'
import { isSupabaseConfigured } from '@/lib/supabase/public'
import { CategoriesManager, type CategoryItem } from '@/components/admin/CategoriesManager'
import { DEFAULT_CATEGORIES } from '@/lib/data/categories'

export const dynamic = 'force-dynamic'

export default async function AdminCategoriesPage() {
  let categories: CategoryItem[] = []

  if (isSupabaseConfigured()) {
    try {
      const db = createAdminClient()
      const { data } = await db.from('categories').select('*').order('sort_order', { ascending: true })
      if (data && data.length > 0) categories = data as CategoryItem[]
    } catch {
      // Fallback
    }
  }

  if (categories.length === 0) {
    categories = DEFAULT_CATEGORIES as CategoryItem[]
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Product Categories
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Add, edit, or reorder categories for online storefront discovery.
        </p>
      </div>

      <CategoriesManager initialCategories={categories} />
    </div>
  )
}
