'use client'

import React, { useState, useMemo } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Search,
  Plus,
  Edit2,
  Copy,
  Trash2,
  Package,
  Layers,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from 'lucide-react'
import { ProductFormSheet } from '@/components/admin/ProductFormSheet'
import {
  toggleProductFlag,
  deleteProduct,
  duplicateProduct,
} from '@/app/admin/actions/products'
import { formatMoney } from '@/lib/pricing'
import { type ProductInput } from '@/lib/validation/product'

interface ProductRow extends ProductInput {
  id: string
  created_at: string
  category?: { id: string; name: string; slug: string } | null
}

interface ProductsTableProps {
  initialProducts: ProductRow[]
  categories: { id: string; name: string; slug: string }[]
}

const PAGE_SIZE = 25

export function ProductsTable({ initialProducts, categories }: ProductsTableProps) {
  const router = useRouter()
  const [products, setProducts] = useState<ProductRow[]>(initialProducts)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)

  // Sheet & Dialog state
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<ProductRow | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isDuplicating, setIsDuplicating] = useState<string | null>(null)

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase()) ||
        (p.subcategory || '').toLowerCase().includes(search.toLowerCase())

      const matchCategory =
        selectedCategory === 'all' || p.category_id === selectedCategory

      return matchSearch && matchCategory
    })
  }, [products, search, selectedCategory])

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE))
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return filteredProducts.slice(start, start + PAGE_SIZE)
  }, [filteredProducts, currentPage])

  // Optimistic flag toggle
  const handleToggleFlag = async (
    id: string,
    flag: 'is_active' | 'is_featured' | 'is_b2b_only' | 'is_new_arrival',
    nextVal: boolean
  ) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [flag]: nextVal } : p))
    )

    const res = await toggleProductFlag(id, flag, nextVal)
    if (!res.ok) {
      // Revert if error
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, [flag]: !nextVal } : p))
      )
    }
  }

  // Handle Delete
  const confirmDelete = async () => {
    if (!deletingProductId) return
    setIsDeleting(true)
    const res = await deleteProduct(deletingProductId)
    if (res.ok) {
      setProducts((prev) => prev.filter((p) => p.id !== deletingProductId))
      setDeleteDialogOpen(false)
      setDeletingProductId(null)
      router.refresh()
    }
    setIsDeleting(false)
  }

  // Handle Duplicate
  const handleDuplicate = async (id: string) => {
    setIsDuplicating(id)
    const res = await duplicateProduct(id)
    if (res.ok) {
      router.refresh()
    }
    setIsDuplicating(null)
  }

  const getPriceRange = (variants: ProductRow['variants']) => {
    if (!variants || variants.length === 0) return 'No packs'
    const inrPrices = variants.map((v) => Number(v.price_inr))
    const minInr = Math.min(...inrPrices)
    const maxInr = Math.max(...inrPrices)
    if (minInr === maxInr) return formatMoney(minInr, 'INR')
    return `${formatMoney(minInr, 'INR')} - ${formatMoney(maxInr, 'INR')}`
  }

  return (
    <div className="space-y-4">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setCurrentPage(1)
              }}
              placeholder="Search product title, SKU, or subcategory..."
              className="pl-9 h-9 text-xs"
            />
          </div>

          <div className="w-48">
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value)
                setCurrentPage(1)
              }}
              className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">All Categories ({products.length})</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Button
          onClick={() => {
            setEditingProduct(null)
            setSheetOpen(true)
          }}
          className="bg-brand-blue hover:bg-brand-blue-700 text-white flex items-center gap-1.5 h-9 text-xs"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </Button>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Cover</TableHead>
              <TableHead>Title &amp; Category</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Pack Sizes</TableHead>
              <TableHead>Price Range</TableHead>
              <TableHead className="text-center">Live / Active</TableHead>
              <TableHead className="text-center">Featured</TableHead>
              <TableHead className="text-center">B2B Only</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-12 text-slate-500">
                  <Package className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  No products found. Click &quot;Add Product&quot; to create your first listing.
                </TableCell>
              </TableRow>
            ) : (
              paginatedProducts.map((p) => {
                const cover = p.images?.[0]
                const categoryName =
                  p.category?.name ||
                  categories.find((c) => c.id === p.category_id)?.name ||
                  'Uncategorized'

                return (
                  <TableRow key={p.id}>
                    <TableCell>
                      <div className="relative w-12 h-12 rounded-lg border border-slate-200 bg-slate-50 overflow-hidden flex items-center justify-center">
                        {cover ? (
                          <Image
                            src={cover}
                            alt={p.title}
                            fill
                            sizes="48px"
                            className="object-contain p-1"
                          />
                        ) : (
                          <Package className="w-5 h-5 text-slate-300" />
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="font-bold text-slate-900">{p.title}</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] text-slate-500 flex items-center gap-1">
                          <Layers className="w-3 h-3 text-slate-400" />
                          {categoryName}
                        </span>
                        {p.is_new_arrival && (
                          <Badge variant="blue" className="text-[9px] py-0 px-1.5">
                            New
                          </Badge>
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="font-mono text-[11px] text-slate-600">
                      {p.sku}
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-wrap gap-1 max-w-[140px]">
                        {(p.variants || []).map((v, i) => (
                          <span
                            key={i}
                            className="inline-block text-[10px] font-semibold bg-brand-lime-100 text-brand-lime-700 px-1.5 py-0.5 rounded border border-brand-lime-600/30"
                          >
                            {v.label}
                          </span>
                        ))}
                      </div>
                    </TableCell>

                    <TableCell className="font-medium text-slate-900">
                      {getPriceRange(p.variants)}
                    </TableCell>

                    {/* Inline switch: Active */}
                    <TableCell className="text-center">
                      <Switch
                        checked={p.is_active}
                        onCheckedChange={(val) => handleToggleFlag(p.id, 'is_active', val)}
                      />
                    </TableCell>

                    {/* Inline switch: Featured */}
                    <TableCell className="text-center">
                      <Switch
                        checked={p.is_featured}
                        onCheckedChange={(val) => handleToggleFlag(p.id, 'is_featured', val)}
                      />
                    </TableCell>

                    {/* Inline switch: B2B Only */}
                    <TableCell className="text-center">
                      <Switch
                        checked={p.is_b2b_only}
                        onCheckedChange={(val) => handleToggleFlag(p.id, 'is_b2b_only', val)}
                      />
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right">
                      <div className="inline-flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingProduct(p)
                            setSheetOpen(true)
                          }}
                          className="h-8 w-8 p-0 text-slate-600 hover:text-brand-blue"
                          title="Edit Product"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={isDuplicating === p.id}
                          onClick={() => handleDuplicate(p.id)}
                          className="h-8 w-8 p-0 text-slate-600 hover:text-emerald-600"
                          title="Duplicate Product"
                        >
                          {isDuplicating === p.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setDeletingProductId(p.id)
                            setDeleteDialogOpen(true)
                          }}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-3 border-t border-slate-200 bg-slate-50 text-xs text-slate-600">
            <div>
              Showing {(currentPage - 1) * PAGE_SIZE + 1} to{' '}
              {Math.min(currentPage * PAGE_SIZE, filteredProducts.length)} of{' '}
              {filteredProducts.length} products
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="h-7 px-2 text-xs"
              >
                <ChevronLeft className="w-3.5 h-3.5 mr-1" /> Prev
              </Button>
              <span className="font-semibold text-slate-800">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="h-7 px-2 text-xs"
              >
                Next <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Product Form Sheet */}
      <ProductFormSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        product={editingProduct}
        categories={categories}
        onSuccess={() => {
          router.refresh()
        }}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Product Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to permanently delete this product and its associated pack sizes and uploaded images? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete Product'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
