import { publicClient, isSupabaseConfigured } from '@/lib/supabase/public'

export interface CategoryItem {
  id: string
  name: string
  slug: string
  image_url?: string | null
  sort_order: number
  is_active: boolean
}

export const CATEGORY_IMAGE_MAP: Record<string, string> = {
  flours:
    'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
  'millet-flours':
    'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80',
  'vrat-special-flours':
    'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
  sabudana:
    'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
  mamra:
    'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
  balls:
    'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
  poha:
    'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80',
  fryums:
    'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80',
  'foochka-khichiya':
    'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
  rice:
    'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
  snacks:
    'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
  sugar:
    'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80',
  jaggery:
    'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80',
  salt:
    'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=600&q=80',
  'vadhvani-marcha':
    'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=600&q=80',
  chikki:
    'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=600&q=80',
  laddu:
    'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
  shrikhand:
    'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=600&q=80',
  'pooja-kit':
    'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
}

export const DEFAULT_CATEGORIES: CategoryItem[] = [
  { id: 'cat-01', name: 'Flours', slug: 'flours', sort_order: 1, is_active: true, image_url: CATEGORY_IMAGE_MAP.flours },
  { id: 'cat-02', name: 'Millet Flours', slug: 'millet-flours', sort_order: 2, is_active: true, image_url: CATEGORY_IMAGE_MAP['millet-flours'] },
  { id: 'cat-03', name: 'Vrat Special Flours', slug: 'vrat-special-flours', sort_order: 3, is_active: true, image_url: CATEGORY_IMAGE_MAP['vrat-special-flours'] },
  { id: 'cat-04', name: 'Sabudana', slug: 'sabudana', sort_order: 4, is_active: true, image_url: CATEGORY_IMAGE_MAP.sabudana },
  { id: 'cat-05', name: 'Mamra', slug: 'mamra', sort_order: 5, is_active: true, image_url: CATEGORY_IMAGE_MAP.mamra },
  { id: 'cat-06', name: 'Balls', slug: 'balls', sort_order: 6, is_active: true, image_url: CATEGORY_IMAGE_MAP.balls },
  { id: 'cat-07', name: 'Poha', slug: 'poha', sort_order: 7, is_active: true, image_url: CATEGORY_IMAGE_MAP.poha },
  { id: 'cat-08', name: 'Fryums', slug: 'fryums', sort_order: 8, is_active: true, image_url: CATEGORY_IMAGE_MAP.fryums },
  { id: 'cat-09', name: 'Foochka & Khichiya', slug: 'foochka-khichiya', sort_order: 9, is_active: true, image_url: CATEGORY_IMAGE_MAP['foochka-khichiya'] },
  { id: 'cat-10', name: 'Rice', slug: 'rice', sort_order: 10, is_active: true, image_url: CATEGORY_IMAGE_MAP.rice },
  { id: 'cat-11', name: 'Snacks', slug: 'snacks', sort_order: 11, is_active: true, image_url: CATEGORY_IMAGE_MAP.snacks },
  { id: 'cat-12', name: 'Sugar', slug: 'sugar', sort_order: 12, is_active: true, image_url: CATEGORY_IMAGE_MAP.sugar },
  { id: 'cat-13', name: 'Jaggery', slug: 'jaggery', sort_order: 13, is_active: true, image_url: CATEGORY_IMAGE_MAP.jaggery },
  { id: 'cat-14', name: 'Salt', slug: 'salt', sort_order: 14, is_active: true, image_url: CATEGORY_IMAGE_MAP.salt },
  { id: 'cat-15', name: 'Vadhvani Marcha', slug: 'vadhvani-marcha', sort_order: 15, is_active: true, image_url: CATEGORY_IMAGE_MAP['vadhvani-marcha'] },
  { id: 'cat-16', name: 'Chikki', slug: 'chikki', sort_order: 16, is_active: true, image_url: CATEGORY_IMAGE_MAP.chikki },
  { id: 'cat-17', name: 'Laddu', slug: 'laddu', sort_order: 17, is_active: true, image_url: CATEGORY_IMAGE_MAP.laddu },
  { id: 'cat-18', name: 'Shrikhand', slug: 'shrikhand', sort_order: 18, is_active: true, image_url: CATEGORY_IMAGE_MAP.shrikhand },
  { id: 'cat-19', name: 'Pooja Kit', slug: 'pooja-kit', sort_order: 19, is_active: true, image_url: CATEGORY_IMAGE_MAP['pooja-kit'] },
]

export async function getCategories(): Promise<CategoryItem[]> {
  if (!isSupabaseConfigured()) {
    return DEFAULT_CATEGORIES
  }

  try {
    let timeoutId: NodeJS.Timeout
    const timeoutPromise = new Promise<null>((resolve) => {
      timeoutId = setTimeout(() => resolve(null), 1500)
    })

    const query = publicClient()
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    const res = await Promise.race([query as any, timeoutPromise])
    clearTimeout(timeoutId!)

    if (!res || !res.data || res.data.length === 0) {
      return DEFAULT_CATEGORIES
    }

    return res.data.map((c: any) => ({
      ...c,
      image_url: c.image_url || CATEGORY_IMAGE_MAP[c.slug] || CATEGORY_IMAGE_MAP.flours,
    }))
  } catch {
    return DEFAULT_CATEGORIES
  }
}

export async function getCategoryBySlug(slug: string): Promise<CategoryItem | null> {
  const fallback = DEFAULT_CATEGORIES.find((c) => c.slug === slug) || null

  if (!isSupabaseConfigured()) {
    return fallback
  }

  try {
    let timeoutId: NodeJS.Timeout
    const timeoutPromise = new Promise<null>((resolve) => {
      timeoutId = setTimeout(() => resolve(null), 1500)
    })

    const query = publicClient()
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .maybeSingle()

    const res = await Promise.race([query as any, timeoutPromise])
    clearTimeout(timeoutId!)

    if (!res || !res.data) {
      return fallback
    }

    return {
      ...res.data,
      image_url: res.data.image_url || CATEGORY_IMAGE_MAP[res.data.slug] || CATEGORY_IMAGE_MAP.flours,
    }
  } catch {
    return fallback
  }
}
