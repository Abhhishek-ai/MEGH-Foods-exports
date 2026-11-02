import { publicClient, isSupabaseConfigured } from '@/lib/supabase/public'
import { type CatalogProduct } from '@/lib/catalog/filter'

export const PRODUCT_SELECT =
  '*, category:categories(id,name,slug), variants:product_variants(*)'

export const CURATED_PRODUCTS: CatalogProduct[] = [
  {
    id: 'prod-001',
    title: 'Rajgira Atta (Pure Amaranth Flour)',
    slug: 'rajgira-atta-amaranth-flour',
    sku: 'MF-FL-001',
    category_id: 'cat-03',
    category: { id: 'cat-03', name: 'Vrat Special Flours', slug: 'vrat-special-flours' },
    subcategory: 'Fasting Specialties',
    short_description:
      'Stone-ground from premium golden amaranth grains. Gluten-free, rich in dietary fiber, iron, and plant protein for wholesome fasting meals.',
    description_md:
      '### Traditional Stone-Milled Amaranth Flour\n\nMegh Foods Rajgira Atta is crafted from carefully sorted, high-elevation amaranth seeds. Renowned as a sacred fasting grain across Gujarat and Maharashtra, this ancient superfood is naturally gluten-free and packed with squalene, calcium, and complete plant proteins.\n\n- **Culinary Uses:** Ideal for rolling soft Rajgira puris, crispy parathas, nutritious sheera, and savory thalipeeth.\n- **Purity Guarantee:** 100% adulterant-free, milled in a dedicated gluten-free and fasting-compliant facility in Ahmedabad.',
    nutrition_info: {
      'Energy': '371 kcal',
      'Protein': '14.5 g',
      'Carbohydrates': '65.2 g',
      'Dietary Fiber': '7.0 g',
      'Iron': '7.6 mg',
    },
    ingredients: '100% Pure Cleaned Golden Amaranth (Rajgira) Grains',
    shelf_life: '9 Months from Packing Date',
    dietary_tags: ['Gluten-Free', 'Vrat Friendly', 'High Protein', 'Vegan', 'Non-GMO'],
    images: [
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80',
    ],
    is_active: true,
    is_featured: true,
    is_b2b_only: false,
    is_new_arrival: false,
    variants: [
      {
        id: 'var-001-1',
        product_id: 'prod-001',
        label: '2 LBS (907g)',
        weight_grams: 907,
        sku: 'MF-FL-001-2LB',
        price_inr: 220,
        price_usd: 5.5,
        sale_price_inr: 199,
        sale_price_usd: 4.99,
        stock_status: 'in_stock',
        is_bulk_only: false,
        sort_order: 1,
      },
      {
        id: 'var-001-2',
        product_id: 'prod-001',
        label: '4 LBS (1.81kg)',
        weight_grams: 1814,
        sku: 'MF-FL-001-4LB',
        price_inr: 420,
        price_usd: 9.8,
        sale_price_inr: null,
        sale_price_usd: null,
        stock_status: 'in_stock',
        is_bulk_only: false,
        sort_order: 2,
      },
      {
        id: 'var-001-3',
        product_id: 'prod-001',
        label: '25kg Bulk Bag',
        weight_grams: 25000,
        sku: 'MF-FL-001-25KG',
        price_inr: 4800,
        price_usd: 68.0,
        sale_price_inr: null,
        sale_price_usd: null,
        stock_status: 'in_stock',
        is_bulk_only: true,
        sort_order: 3,
      },
    ],
  },
  {
    id: 'prod-002',
    title: 'Singhare Ka Atta (Water Chestnut Flour)',
    slug: 'singhare-ka-atta-water-chestnut-flour',
    sku: 'MF-FL-002',
    category_id: 'cat-03',
    category: { id: 'cat-03', name: 'Vrat Special Flours', slug: 'vrat-special-flours' },
    subcategory: 'Fasting Specialties',
    short_description:
      'Sun-dried and fine-milled water chestnut flour. Naturally cooling, detoxifying, and a staple for authentic Navratri and Shivratri delicacies.',
    description_md:
      '### Authentic Sun-Dried Singhara Flour\n\nHarvested from certified freshwater lake wetlands and slowly sun-dried prior to milling, our Singhare Ka Atta yields a silky, snow-white flour renowned for its cooling ayurvedic properties.\n\n- **Culinary Uses:** Singhare ki pakodi, halwa, puris, and fasting cheelas.\n- **Storage:** Packaged with oxygen absorbers to ensure maximum freshness during international transit.',
    nutrition_info: {
      'Energy': '353 kcal',
      'Protein': '4.1 g',
      'Carbohydrates': '78.5 g',
      'Dietary Fiber': '3.2 g',
      'Potassium': '580 mg',
    },
    ingredients: '100% Dried Water Chestnuts (Singhara)',
    shelf_life: '9 Months from Packing Date',
    dietary_tags: ['Gluten-Free', 'Vrat Friendly', 'Digestive', 'Vegan'],
    images: [
      'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
    ],
    is_active: true,
    is_featured: true,
    is_b2b_only: false,
    is_new_arrival: false,
    variants: [
      {
        id: 'var-002-1',
        product_id: 'prod-002',
        label: '2 LBS (907g)',
        weight_grams: 907,
        sku: 'MF-FL-002-2LB',
        price_inr: 240,
        price_usd: 5.8,
        sale_price_inr: null,
        sale_price_usd: null,
        stock_status: 'in_stock',
        is_bulk_only: false,
        sort_order: 1,
      },
      {
        id: 'var-002-2',
        product_id: 'prod-002',
        label: '4 LBS (1.81kg)',
        weight_grams: 1814,
        sku: 'MF-FL-002-4LB',
        price_inr: 460,
        price_usd: 10.5,
        sale_price_inr: 430,
        sale_price_usd: 9.75,
        stock_status: 'in_stock',
        is_bulk_only: false,
        sort_order: 2,
      },
    ],
  },
  {
    id: 'prod-003',
    title: 'Stone-Ground Sharbati Whole Wheat Atta',
    slug: 'sharbati-whole-wheat-atta',
    sku: 'MF-FL-003',
    category_id: 'cat-01',
    category: { id: 'cat-01', name: 'Flours', slug: 'flours' },
    subcategory: 'Traditional Grain Flours',
    short_description:
      'Chakki-ground from golden Sehore Sharbati wheat grains. Yields naturally sweet, super-soft rotis that stay tender for hours.',
    description_md:
      '### The King of Wheat Flours\n\nCultivated in the mineral-rich black soils of central India, Sharbati wheat grains are bathed in abundant sunlight to produce plump, golden berries with naturally higher sweetness.\n\n- **Chakki Fresh Milling:** Traditional slow stone grinding prevents heat generation, retaining vital bran fibers, wheatgerm oils, and vitamins.\n- **Zero Maida / Zero Additives:** 100% whole grain wheat.',
    nutrition_info: {
      'Energy': '364 kcal',
      'Protein': '12.1 g',
      'Carbohydrates': '71.2 g',
      'Dietary Fiber': '11.5 g',
    },
    ingredients: '100% Certified Whole Sharbati Wheat',
    shelf_life: '6 Months from Packing Date',
    dietary_tags: ['100% Whole Grain', 'High Fiber', 'Chakki Ground', 'Vegetarian'],
    images: [
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80',
    ],
    is_active: true,
    is_featured: true,
    is_b2b_only: false,
    is_new_arrival: false,
    variants: [
      {
        id: 'var-003-1',
        product_id: 'prod-003',
        label: '4 LBS (1.81kg)',
        weight_grams: 1814,
        sku: 'MF-FL-003-4LB',
        price_inr: 280,
        price_usd: 6.5,
        sale_price_inr: null,
        sale_price_usd: null,
        stock_status: 'in_stock',
        is_bulk_only: false,
        sort_order: 1,
      },
      {
        id: 'var-003-2',
        product_id: 'prod-003',
        label: '8 LBS (3.62kg)',
        weight_grams: 3628,
        sku: 'MF-FL-003-8LB',
        price_inr: 520,
        price_usd: 12.0,
        sale_price_inr: 480,
        sale_price_usd: 10.99,
        stock_status: 'in_stock',
        is_bulk_only: false,
        sort_order: 2,
      },
    ],
  },
  {
    id: 'prod-004',
    title: 'Authentic Gujarati Poha (Thick Flattened Rice)',
    slug: 'gujarati-thick-poha-flattened-rice',
    sku: 'MF-PO-001',
    category_id: 'cat-07',
    category: { id: 'cat-07', name: 'Poha', slug: 'poha' },
    subcategory: 'Rice Products',
    short_description:
      'Crisp, uniformly thick flattened rice flakes processed from aged paddy. Holds shape beautifully without turning mushy when seasoned.',
    description_md:
      '### Gujarat’s Breakfast Classic\n\nMegh Foods Thick Poha is produced by gently parboiling and roller-pressing premium aged paddy. The flakes are thick enough to absorb mustard seeds, turmeric, green chillies, roasted peanuts, and lemon juice without crumbling.\n\n- **Quick Cooking:** Requires only a gentle 2-minute rinse before tossing in the pan.',
    nutrition_info: {
      'Energy': '350 kcal',
      'Protein': '7.0 g',
      'Carbohydrates': '77.3 g',
      'Iron': '4.2 mg',
    },
    ingredients: '100% Dehusked Flattened Rice Flakes',
    shelf_life: '12 Months from Packing Date',
    dietary_tags: ['Gluten-Free', 'Low Fat', 'Easy Digest', 'Vegan'],
    images: [
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80',
    ],
    is_active: true,
    is_featured: true,
    is_b2b_only: false,
    is_new_arrival: false,
    variants: [
      {
        id: 'var-004-1',
        product_id: 'prod-004',
        label: '2 LBS (907g)',
        weight_grams: 907,
        sku: 'MF-PO-001-2LB',
        price_inr: 160,
        price_usd: 3.9,
        sale_price_inr: null,
        sale_price_usd: null,
        stock_status: 'in_stock',
        is_bulk_only: false,
        sort_order: 1,
      },
      {
        id: 'var-004-2',
        product_id: 'prod-004',
        label: '4 LBS (1.81kg)',
        weight_grams: 1814,
        sku: 'MF-PO-001-4LB',
        price_inr: 300,
        price_usd: 7.2,
        sale_price_inr: 275,
        sale_price_usd: 6.5,
        stock_status: 'in_stock',
        is_bulk_only: false,
        sort_order: 2,
      },
    ],
  },
  {
    id: 'prod-005',
    title: 'Premium White Pearl Sabudana (Tapioca Sago)',
    slug: 'premium-pearl-sabudana-tapioca-sago',
    sku: 'MF-SB-001',
    category_id: 'cat-04',
    category: { id: 'cat-04', name: 'Sabudana', slug: 'sabudana' },
    subcategory: 'Fasting Staples',
    short_description:
      'Gleaming, spherical tapioca pearls manufactured from pure cassava roots. Perfect for non-sticky Sabudana Khichdi and crunchy vadas.',
    description_md:
      '### Royal Pearl Sabudana\n\nOur Sabudana pearls undergo a multi-stage grading and polishing process to guarantee uniform diameter and rapid, even water absorption. When soaked, each pearl swells into a translucent, tender globe that never clumps.\n\n- **Fasting Essential:** Sacred for Navratri, Ekadashi, and Maha Shivratri.',
    nutrition_info: {
      'Energy': '358 kcal',
      'Carbohydrates': '88.7 g',
      'Protein': '0.2 g',
      'Calcium': '10 mg',
    },
    ingredients: '100% Tapioca Root Starch',
    shelf_life: '18 Months from Packing Date',
    dietary_tags: ['Gluten-Free', 'Vrat Special', 'Pure Vegan'],
    images: [
      'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
    ],
    is_active: true,
    is_featured: true,
    is_b2b_only: false,
    is_new_arrival: true,
    variants: [
      {
        id: 'var-005-1',
        product_id: 'prod-005',
        label: '2 LBS (907g)',
        weight_grams: 907,
        sku: 'MF-SB-001-2LB',
        price_inr: 180,
        price_usd: 4.2,
        sale_price_inr: null,
        sale_price_usd: null,
        stock_status: 'in_stock',
        is_bulk_only: false,
        sort_order: 1,
      },
      {
        id: 'var-005-2',
        product_id: 'prod-005',
        label: '4 LBS (1.81kg)',
        weight_grams: 1814,
        sku: 'MF-SB-001-4LB',
        price_inr: 340,
        price_usd: 7.9,
        sale_price_inr: null,
        sale_price_usd: null,
        stock_status: 'in_stock',
        is_bulk_only: false,
        sort_order: 2,
      },
    ],
  },
  {
    id: 'prod-006',
    title: 'Organic Desi Kolhapuri Jaggery (Gur Block)',
    slug: 'organic-desi-jaggery-gur-block',
    sku: 'MF-JG-001',
    category_id: 'cat-13',
    category: { id: 'cat-13', name: 'Jaggery', slug: 'jaggery' },
    subcategory: 'Traditional Sweeteners',
    short_description:
      'Natural, chemical-free cane jaggery prepared in traditional iron woks. Rich in iron and minerals with a deep caramel aroma.',
    description_md:
      '### Unrefined Pure Sugar Cane Jaggery\n\nCrafted from the first pressing of fresh sugar cane juice without artificial bleaches or clarifying chemicals. Deep amber in color with a soft, fudgy bite and authentic mineral-rich sweetness.\n\n- **Usage:** Ideal for winter laddoos, Gujarati dal, puran poli, and herbal chai.',
    nutrition_info: {
      'Energy': '383 kcal',
      'Sucrose': '75 g',
      'Iron': '11 mg',
      'Magnesium': '70 mg',
    },
    ingredients: '100% Clarified Sugarcane Juice',
    shelf_life: '12 Months from Packing Date',
    dietary_tags: ['Unrefined', 'Chemical-Free', 'High Iron', 'Vegan'],
    images: [
      'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=800&q=80',
    ],
    is_active: true,
    is_featured: true,
    is_b2b_only: false,
    is_new_arrival: false,
    variants: [
      {
        id: 'var-006-1',
        product_id: 'prod-006',
        label: '1 kg Block',
        weight_grams: 1000,
        sku: 'MF-JG-001-1KG',
        price_inr: 150,
        price_usd: 3.5,
        sale_price_inr: 135,
        sale_price_usd: 2.99,
        stock_status: 'in_stock',
        is_bulk_only: false,
        sort_order: 1,
      },
      {
        id: 'var-006-2',
        product_id: 'prod-006',
        label: '5 kg Master Box',
        weight_grams: 5000,
        sku: 'MF-JG-001-5KG',
        price_inr: 680,
        price_usd: 15.0,
        sale_price_inr: null,
        sale_price_usd: null,
        stock_status: 'in_stock',
        is_bulk_only: false,
        sort_order: 2,
      },
    ],
  },
  {
    id: 'prod-007',
    title: 'Colourful Wheel & Tube Fryums (Far Far Pellets)',
    slug: 'colourful-wheel-tube-fryums-far-far',
    sku: 'MF-FR-001',
    category_id: 'cat-08',
    category: { id: 'cat-08', name: 'Fryums', slug: 'fryums' },
    subcategory: 'Savoury Pellets',
    short_description:
      'Crisp sun-dried wheat and tapioca snack pellets. Expands instantly in hot oil into light, crunchy party fryums loved across generations.',
    description_md:
      '### Traditional Indian Snack Pellets (Far Far)\n\nPrepared from refined wheat flour and food-grade natural vegetable extracts, our fryums expand to 3x their volume when fried in hot oil for 5 seconds. Dust with chaat masala or black salt for an irresistible tea-time accompaniment.',
    nutrition_info: {
      'Energy': '360 kcal',
      'Carbohydrates': '82 g',
      'Protein': '7.5 g',
    },
    ingredients: 'Wheat Flour, Tapioca Starch, Salt, Natural Edible Colors',
    shelf_life: '18 Months from Packing Date',
    dietary_tags: ['Instant Crisp', 'Party Snack', 'Vegan'],
    images: [
      'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
    ],
    is_active: true,
    is_featured: true,
    is_b2b_only: false,
    is_new_arrival: false,
    variants: [
      {
        id: 'var-007-1',
        product_id: 'prod-007',
        label: '500g Pouch',
        weight_grams: 500,
        sku: 'MF-FR-001-500G',
        price_inr: 120,
        price_usd: 2.8,
        sale_price_inr: null,
        sale_price_usd: null,
        stock_status: 'in_stock',
        is_bulk_only: false,
        sort_order: 1,
      },
      {
        id: 'var-007-2',
        product_id: 'prod-007',
        label: '1 kg Pouch',
        weight_grams: 1000,
        sku: 'MF-FR-001-1KG',
        price_inr: 220,
        price_usd: 5.2,
        sale_price_inr: 195,
        sale_price_usd: 4.6,
        stock_status: 'in_stock',
        is_bulk_only: false,
        sort_order: 2,
      },
    ],
  },
  {
    id: 'prod-008',
    title: 'Desi Ghee Besan Laddu (Artisanal Sweets)',
    slug: 'desi-ghee-besan-laddu',
    sku: 'MF-LD-001',
    category_id: 'cat-17',
    category: { id: 'cat-17', name: 'Laddu', slug: 'laddu' },
    subcategory: 'Traditional Sweets',
    short_description:
      'Slow-roasted coarse chickpea flour simmered in pure A2 cow ghee, crushed cardamom, and crunchy almond slivers. Melts in your mouth.',
    description_md:
      '### Royal Indian Festive Delicacy\n\nMade the authentic way: coarse gram flour (chana dal) is roasted patiently over a low flame in fragrant desi cow ghee until a rich nutty aroma emerges. Vacuum-sealed in nitrogen-flushed boxes to preserve pristine freshness across international flights.',
    nutrition_info: {
      'Energy': '490 kcal',
      'Protein': '9.2 g',
      'Fat': '26 g',
      'Carbohydrates': '56 g',
    },
    ingredients: 'Coarse Besan, Pure Desi Cow Ghee, Bura Sugar, Green Cardamom, Almonds, Pistachios',
    shelf_life: '60 Days from Packing Date',
    dietary_tags: ['Pure Desi Ghee', 'No Artificial Flavors', 'Vegetarian'],
    images: [
      'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=800&q=80',
    ],
    is_active: true,
    is_featured: true,
    is_b2b_only: false,
    is_new_arrival: true,
    variants: [
      {
        id: 'var-008-1',
        product_id: 'prod-008',
        label: '500g Gift Box',
        weight_grams: 500,
        sku: 'MF-LD-001-500G',
        price_inr: 390,
        price_usd: 8.5,
        sale_price_inr: null,
        sale_price_usd: null,
        stock_status: 'in_stock',
        is_bulk_only: false,
        sort_order: 1,
      },
      {
        id: 'var-008-2',
        product_id: 'prod-008',
        label: '1 kg Festive Tin',
        weight_grams: 1000,
        sku: 'MF-LD-001-1KG',
        price_inr: 750,
        price_usd: 16.5,
        sale_price_inr: 699,
        sale_price_usd: 14.99,
        stock_status: 'in_stock',
        is_bulk_only: false,
        sort_order: 2,
      },
    ],
  },
]

// Timeout helper: guarantees that a database query cannot freeze the server for more than 1.5 seconds
async function withTimeout<T>(promise: Promise<T>, ms = 1500): Promise<{ data: any; error: any } | null> {
  let timeoutId: NodeJS.Timeout
  const timeoutPromise = new Promise<null>((resolve) => {
    timeoutId = setTimeout(() => resolve(null), ms)
  })

  try {
    const result = (await Promise.race([promise, timeoutPromise])) as any
    return result
  } catch {
    return null
  } finally {
    clearTimeout(timeoutId!)
  }
}

export async function getActiveProducts(): Promise<CatalogProduct[]> {
  if (!isSupabaseConfigured()) {
    return CURATED_PRODUCTS
  }

  try {
    const query = publicClient()
      .from('products')
      .select(PRODUCT_SELECT)
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    const res = await withTimeout(query as any, 1500)
    if (!res || !res.data || res.data.length === 0) {
      return CURATED_PRODUCTS
    }
    return res.data as CatalogProduct[]
  } catch {
    return CURATED_PRODUCTS
  }
}

export async function getProductBySlug(slug: string): Promise<CatalogProduct | null> {
  const fallback = CURATED_PRODUCTS.find((p) => p.slug === slug) || null

  if (!isSupabaseConfigured()) {
    return fallback
  }

  try {
    const query = publicClient()
      .from('products')
      .select(PRODUCT_SELECT)
      .eq('slug', slug)
      .eq('is_active', true)
      .maybeSingle()

    const res = await withTimeout(query as any, 1500)
    if (!res || !res.data) {
      return fallback
    }
    return res.data as CatalogProduct
  } catch {
    return fallback
  }
}

export async function getFeaturedProducts(limit = 8): Promise<CatalogProduct[]> {
  const fallback = CURATED_PRODUCTS.filter((p) => p.is_featured).slice(0, limit)

  if (!isSupabaseConfigured()) {
    return fallback
  }

  try {
    const query = publicClient()
      .from('products')
      .select(PRODUCT_SELECT)
      .eq('is_active', true)
      .eq('is_featured', true)
      .limit(limit)

    const res = await withTimeout(query as any, 1500)
    if (!res || !res.data || res.data.length === 0) {
      return fallback
    }
    return res.data as CatalogProduct[]
  } catch {
    return fallback
  }
}

export async function getRelatedProducts(
  categoryId: string | null,
  excludeProductId: string,
  limit = 4
): Promise<CatalogProduct[]> {
  const fallback = CURATED_PRODUCTS.filter((p) => p.id !== excludeProductId).slice(0, limit)

  if (!isSupabaseConfigured() || !categoryId) {
    return fallback
  }

  try {
    const query = publicClient()
      .from('products')
      .select(PRODUCT_SELECT)
      .eq('is_active', true)
      .eq('category_id', categoryId)
      .neq('id', excludeProductId)
      .limit(limit)

    const res = await withTimeout(query as any, 1500)
    if (!res || !res.data || res.data.length === 0) {
      return fallback
    }
    return res.data as CatalogProduct[]
  } catch {
    return fallback
  }
}

export async function getAllSlugs(): Promise<{ slug: string; updated_at?: string }[]> {
  const fallback = CURATED_PRODUCTS.map((p) => ({ slug: p.slug, updated_at: new Date().toISOString() }))

  if (!isSupabaseConfigured()) {
    return fallback
  }

  try {
    const query = publicClient()
      .from('products')
      .select('slug, updated_at')
      .eq('is_active', true)

    const res = await withTimeout(query as any, 1500)
    if (!res || !res.data || res.data.length === 0) {
      return fallback
    }
    return res.data
  } catch {
    return fallback
  }
}
