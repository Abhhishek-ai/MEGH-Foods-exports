import { z } from 'zod'

export const variantSchema = z.object({
  id: z.string().uuid().optional(),
  label: z.string().trim().min(1, 'Required'),
  weight_grams: z.coerce.number().int().positive('Must be greater than 0'),
  sku: z.string().trim().min(1, 'Required'),
  price_inr: z.coerce.number().nonnegative('Cannot be negative'),
  price_usd: z.coerce.number().nonnegative('Cannot be negative'),
  sale_price_inr: z.coerce.number().nonnegative().nullable().optional(),
  sale_price_usd: z.coerce.number().nonnegative().nullable().optional(),
  stock_status: z.enum(['in_stock', 'out_of_stock', 'made_to_order']),
  is_bulk_only: z.boolean().default(false),
  sort_order: z.coerce.number().int().default(0),
})

export const productSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().trim().min(2, 'Title must be at least 2 characters').max(160),
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Lowercase letters, numbers and hyphens only'),
  sku: z.string().trim().min(1, 'Product SKU is required'),
  category_id: z.string().uuid().nullable(),
  subcategory: z.string().trim().max(80).nullable().optional(),
  short_description: z.string().trim().max(280, 'Max 280 characters').default(''),
  description_md: z.string().default(''),
  nutrition_info: z.record(z.string(), z.string()).default({}),
  ingredients: z.string().nullable().optional(),
  shelf_life: z.string().nullable().optional(),
  dietary_tags: z.array(z.string()).default([]),
  images: z.array(z.string().url()).default([]),
  is_active: z.boolean().default(true),
  is_featured: z.boolean().default(false),
  is_b2b_only: z.boolean().default(false),
  is_new_arrival: z.boolean().default(false),
  seo_title: z.string().max(70).nullable().optional(),
  seo_description: z.string().max(160).nullable().optional(),
  variants: z.array(variantSchema).min(1, 'Add at least one pack size'),
})

export type ProductInput = z.infer<typeof productSchema>
export type VariantInput = z.infer<typeof variantSchema>
