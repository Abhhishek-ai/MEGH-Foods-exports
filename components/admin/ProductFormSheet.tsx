'use client'

import React, { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { productSchema, type ProductInput, type VariantInput } from '@/lib/validation/product'
import { ImageUploader } from '@/components/admin/ImageUploader'
import { VariantsEditor } from '@/components/admin/VariantsEditor'
import { MarkdownField } from '@/components/admin/MarkdownField'
import { saveProduct } from '@/app/admin/actions/products'
import { Plus, Trash2, Loader2, Sparkles } from 'lucide-react'

const COMMON_DIETARY_TAGS = [
  'vegan',
  'gluten-free',
  'vrat',
  'traditional',
  'stone-ground',
  'non-gmo',
  'no-preservatives',
  'high-fiber',
  'jain-friendly',
]

interface CategoryOption {
  id: string
  name: string
  slug: string
}

interface ProductFormSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product?: (ProductInput & { id?: string }) | null
  categories: CategoryOption[]
  onSuccess: () => void
}

export function ProductFormSheet({
  open,
  onOpenChange,
  product,
  categories,
  onSuccess,
}: ProductFormSheetProps) {
  const [activeTab, setActiveTab] = useState('general')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [customTagInput, setCustomTagInput] = useState('')

  const defaultValues: ProductInput = {
    title: '',
    slug: '',
    sku: '',
    category_id: categories[0]?.id || null,
    subcategory: '',
    short_description: '',
    description_md: '',
    nutrition_info: {
      'Energy': '360 kcal',
      'Protein': '8.5 g',
      'Carbohydrates': '76 g',
      'Fat': '1.2 g',
    },
    ingredients: '',
    shelf_life: '12 Months',
    dietary_tags: ['traditional'],
    images: [],
    is_active: true,
    is_featured: false,
    is_b2b_only: false,
    is_new_arrival: false,
    seo_title: '',
    seo_description: '',
    variants: [
      {
        label: '2LBS',
        weight_grams: 908,
        sku: 'MF-VAR-1',
        price_inr: 149,
        price_usd: 4.99,
        sale_price_inr: null,
        sale_price_usd: null,
        stock_status: 'in_stock',
        is_bulk_only: false,
        sort_order: 0,
      },
    ],
  }

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues,
  })

  useEffect(() => {
    if (product) {
      reset({
        ...product,
        category_id: product.category_id || categories[0]?.id || null,
      })
    } else {
      reset({
        title: '',
        slug: '',
        sku: '',
        category_id: categories[0]?.id || null,
        subcategory: '',
        short_description: '',
        description_md: '',
        nutrition_info: {
          Energy: '360 kcal',
          Protein: '8.5 g',
          Carbohydrates: '76 g',
          Fat: '1.2 g',
        },
        ingredients: '',
        shelf_life: '12 Months',
        dietary_tags: ['traditional'],
        images: [],
        is_active: true,
        is_featured: false,
        is_b2b_only: false,
        is_new_arrival: false,
        seo_title: '',
        seo_description: '',
        variants: [
          {
            label: '2LBS',
            weight_grams: 908,
            sku: 'MF-VAR-1',
            price_inr: 149,
            price_usd: 4.99,
            sale_price_inr: null,
            sale_price_usd: null,
            stock_status: 'in_stock',
            is_bulk_only: false,
            sort_order: 0,
          },
        ],
      })
    }
    setServerError(null)
  }, [product, open, reset, categories])

  const titleVal = watch('title')
  const slugVal = watch('slug')
  const shortDescVal = watch('short_description') || ''
  const dietaryTagsVal = watch('dietary_tags') || []
  const nutritionVal = watch('nutrition_info') || {}

  const generateSlugFromTitle = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value
    setValue('title', newTitle)
    // Auto generate slug if slug hasn't been manually detached or is empty
    if (!product || !slugVal) {
      setValue('slug', generateSlugFromTitle(newTitle))
    }
  }

  const toggleDietaryTag = (tag: string) => {
    if (dietaryTagsVal.includes(tag)) {
      setValue('dietary_tags', dietaryTagsVal.filter((t) => t !== tag))
    } else {
      setValue('dietary_tags', [...dietaryTagsVal, tag])
    }
  }

  const addCustomTag = () => {
    const clean = customTagInput.trim().toLowerCase()
    if (clean && !dietaryTagsVal.includes(clean)) {
      setValue('dietary_tags', [...dietaryTagsVal, clean])
      setCustomTagInput('')
    }
  }

  const updateNutritionRow = (oldKey: string, newKey: string, val: string) => {
    const updated = { ...nutritionVal }
    if (oldKey !== newKey) {
      delete updated[oldKey]
    }
    if (newKey) {
      updated[newKey] = val
    }
    setValue('nutrition_info', updated)
  }

  const addNutritionRow = () => {
    setValue('nutrition_info', {
      ...nutritionVal,
      [`Fact ${Object.keys(nutritionVal).length + 1}`]: '',
    })
  }

  const removeNutritionRow = (key: string) => {
    const updated = { ...nutritionVal }
    delete updated[key]
    setValue('nutrition_info', updated)
  }

  const onSubmit = async (data: ProductInput) => {
    setIsSubmitting(true)
    setServerError(null)

    const res = await saveProduct({
      ...data,
      id: product?.id,
    })

    if (!res.ok) {
      setServerError(res.error || 'Failed to save product.')
      setIsSubmitting(false)
      return
    }

    setIsSubmitting(false)
    onOpenChange(false)
    onSuccess()
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-3xl flex flex-col p-0">
        <SheetHeader className="p-6 border-b border-slate-200">
          <SheetTitle className="text-xl font-black text-slate-900">
            {product?.id ? 'Edit Product' : 'Add New Product'}
          </SheetTitle>
          <SheetDescription className="text-xs text-slate-500">
            Configure product catalog details, pack sizes, WebP imagery, and export specifications.
          </SheetDescription>
        </SheetHeader>

        {serverError && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 text-xs text-red-700 rounded-lg">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col overflow-hidden">
          <div className="p-6 flex-1 overflow-y-auto space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-5 w-full bg-slate-100 p-1 rounded-xl">
                <TabsTrigger value="general" className="text-xs">General</TabsTrigger>
                <TabsTrigger value="variants" className="text-xs">Pack Sizes</TabsTrigger>
                <TabsTrigger value="images" className="text-xs">Images</TabsTrigger>
                <TabsTrigger value="details" className="text-xs">Specs &amp; SEO</TabsTrigger>
                <TabsTrigger value="flags" className="text-xs">Status</TabsTrigger>
              </TabsList>

              {/* TAB 1: GENERAL */}
              <TabsContent value="general" className="space-y-4 pt-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Product Title *</label>
                  <Input
                    {...register('title')}
                    onChange={handleTitleChange}
                    placeholder="e.g. Premium Singhare Ka Atta (Water Chestnut Flour)"
                    required
                  />
                  {errors.title && <p className="text-[11px] text-red-600">{errors.title.message}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">URL Slug *</label>
                    <Input
                      {...register('slug')}
                      placeholder="singhare-ka-atta"
                      required
                    />
                    {errors.slug && <p className="text-[11px] text-red-600">{errors.slug.message}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Base SKU *</label>
                    <Input
                      {...register('sku')}
                      placeholder="MF-SNG-01"
                      required
                    />
                    {errors.sku && <p className="text-[11px] text-red-600">{errors.sku.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Category *</label>
                    <Controller
                      name="category_id"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value || undefined}
                          onValueChange={(val) => field.onChange(val)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((c) => (
                              <SelectItem key={c.id} value={c.id}>
                                {c.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Sub-category</label>
                    <Input
                      {...register('subcategory')}
                      placeholder="e.g. Vrat &amp; Fasting Specials"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <label className="text-xs font-semibold text-slate-700">Short Description (max 280 chars)</label>
                    <span className="text-[10px] text-slate-400">{shortDescVal.length}/280</span>
                  </div>
                  <Textarea
                    {...register('short_description')}
                    maxLength={280}
                    placeholder="Brief highlight shown on catalog cards and search previews..."
                    className="h-20 text-xs"
                  />
                  {errors.short_description && (
                    <p className="text-[11px] text-red-600">{errors.short_description.message}</p>
                  )}
                </div>

                <Controller
                  name="description_md"
                  control={control}
                  render={({ field }) => (
                    <MarkdownField
                      label="Full Description (Markdown)"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              </TabsContent>

              {/* TAB 2: VARIANTS */}
              <TabsContent value="variants" className="space-y-4 pt-4">
                <Controller
                  name="variants"
                  control={control}
                  render={({ field }) => (
                    <VariantsEditor
                      variants={field.value}
                      onChange={field.onChange}
                      productSku={watch('sku')}
                    />
                  )}
                />
                {errors.variants && (
                  <p className="text-xs text-red-600 font-semibold">{errors.variants.message}</p>
                )}
              </TabsContent>

              {/* TAB 3: IMAGES */}
              <TabsContent value="images" className="space-y-4 pt-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Product Photography</h4>
                  <p className="text-xs text-slate-500 mb-3">
                    Images are automatically compressed to WebP and saved into Supabase Storage. First image is the primary cover.
                  </p>
                  <Controller
                    name="images"
                    control={control}
                    render={({ field }) => (
                      <ImageUploader
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </div>
              </TabsContent>

              {/* TAB 4: SPECS & SEO */}
              <TabsContent value="details" className="space-y-6 pt-4">
                {/* Nutrition facts */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">Nutrition Facts (per 100g)</h4>
                      <p className="text-[11px] text-slate-500">Key / value pairs shown on PDP</p>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={addNutritionRow}
                      className="h-7 text-xs flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Add Fact
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {Object.entries(nutritionVal).map(([key, val], idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <Input
                          value={key}
                          placeholder="Nutrient (e.g. Protein)"
                          className="h-8 text-xs"
                          onChange={(e) => updateNutritionRow(key, e.target.value, val)}
                        />
                        <Input
                          value={val}
                          placeholder="Amount (e.g. 10 g)"
                          className="h-8 text-xs"
                          onChange={(e) => updateNutritionRow(key, key, e.target.value)}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeNutritionRow(key)}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Ingredients</label>
                    <Input
                      {...register('ingredients')}
                      placeholder="e.g. 100% Pure Singharo (Water Chestnut)"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Shelf Life</label>
                    <Input
                      {...register('shelf_life')}
                      placeholder="e.g. 12 Months from packaging"
                    />
                  </div>
                </div>

                {/* Dietary tags */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700">Dietary &amp; Processing Tags</label>
                  <div className="flex flex-wrap gap-1.5">
                    {COMMON_DIETARY_TAGS.map((tag) => {
                      const active = dietaryTagsVal.includes(tag)
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => toggleDietaryTag(tag)}
                          className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                            active
                              ? 'bg-brand-blue text-white border-brand-blue font-semibold'
                              : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                          }`}
                        >
                          {tag}
                        </button>
                      )
                    })}
                  </div>

                  <div className="flex gap-2 pt-1">
                    <Input
                      value={customTagInput}
                      onChange={(e) => setCustomTagInput(e.target.value)}
                      placeholder="Add custom tag (e.g. vacuum-sealed)..."
                      className="h-8 text-xs"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          addCustomTag()
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addCustomTag}
                      className="h-8 text-xs"
                    >
                      Add
                    </Button>
                  </div>
                </div>

                {/* SEO Fields */}
                <div className="space-y-3 pt-2 border-t border-slate-200">
                  <h4 className="text-xs font-bold text-slate-800">Search Engine Optimization (SEO)</h4>
                  <div className="space-y-2">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-600">SEO Title (max 70)</label>
                      <Input
                        {...register('seo_title')}
                        maxLength={70}
                        placeholder="Default: <Product Title> | Megh Foods"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-600">SEO Description (max 160)</label>
                      <Textarea
                        {...register('seo_description')}
                        maxLength={160}
                        placeholder="Default: <Short Description>"
                        className="h-16 text-xs"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* TAB 5: FLAGS */}
              <TabsContent value="flags" className="space-y-4 pt-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-900">Active / Live in Store</p>
                      <p className="text-[11px] text-slate-500">Visible to online buyers and search engines</p>
                    </div>
                    <Controller
                      name="is_active"
                      control={control}
                      render={({ field }) => (
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      )}
                    />
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <div>
                      <p className="text-xs font-bold text-slate-900">Featured on Homepage</p>
                      <p className="text-[11px] text-slate-500">Showcases in the curated bestselling strip</p>
                    </div>
                    <Controller
                      name="is_featured"
                      control={control}
                      render={({ field }) => (
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      )}
                    />
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <div>
                      <p className="text-xs font-bold text-slate-900">B2B Wholesale Only</p>
                      <p className="text-[11px] text-slate-500">Hides retail add-to-cart; quote inquiry only</p>
                    </div>
                    <Controller
                      name="is_b2b_only"
                      control={control}
                      render={({ field }) => (
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      )}
                    />
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <div>
                      <p className="text-xs font-bold text-slate-900">New Arrival Badge</p>
                      <p className="text-[11px] text-slate-500">Highlights product with a New Arrival chip</p>
                    </div>
                    <Controller
                      name="is_new_arrival"
                      control={control}
                      render={({ field }) => (
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      )}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <SheetFooter className="p-6 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-brand-blue hover:bg-brand-blue-700 text-white min-w-[120px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" /> Saving...
                </>
              ) : (
                'Save Product'
              )}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
