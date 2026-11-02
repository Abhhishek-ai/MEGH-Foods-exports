'use client'

import React, { useState } from 'react'
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Plus, Edit2, Trash2, Layers, Loader2 } from 'lucide-react'
import {
  saveCategory,
  deleteCategory,
  toggleCategoryActive,
} from '@/app/admin/actions/categories'

export interface CategoryItem {
  id: string
  name: string
  slug: string
  image_url: string | null
  sort_order: number
  is_active: boolean
  created_at: string
}

interface CategoriesManagerProps {
  initialCategories: CategoryItem[]
}

export function CategoriesManager({ initialCategories }: CategoriesManagerProps) {
  const router = useRouter()
  const [categories, setCategories] = useState<CategoryItem[]>(initialCategories)

  // Dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Partial<CategoryItem> | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  // Delete state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleToggle = async (id: string, nextActive: boolean) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, is_active: nextActive } : c))
    )
    const res = await toggleCategoryActive(id, nextActive)
    if (!res.ok) {
      setCategories((prev) =>
        prev.map((c) => (c.id === id ? { ...c, is_active: !nextActive } : c))
      )
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingCategory?.name || !editingCategory?.slug) return

    setIsSubmitting(true)
    setFormError(null)

    const res = await saveCategory(editingCategory)
    if (!res.ok) {
      setFormError(res.error || 'Failed to save category')
      setIsSubmitting(false)
      return
    }

    setIsSubmitting(false)
    setEditDialogOpen(false)
    setEditingCategory(null)
    router.refresh()
  }

  const confirmDelete = async () => {
    if (!deletingId) return
    setIsDeleting(true)
    const res = await deleteCategory(deletingId)
    if (res.ok) {
      setCategories((prev) => prev.filter((c) => c.id !== deletingId))
      setDeleteDialogOpen(false)
      setDeletingId(null)
      router.refresh()
    }
    setIsDeleting(false)
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-slate-800">
            All Product Categories ({categories.length})
          </h2>
          <p className="text-xs text-slate-500">
            Categories govern storefront navigation, filtering pills, and home grids.
          </p>
        </div>

        <Button
          onClick={() => {
            setEditingCategory({
              name: '',
              slug: '',
              image_url: null,
              sort_order: categories.length + 1,
              is_active: true,
            })
            setFormError(null)
            setEditDialogOpen(true)
          }}
          className="bg-brand-blue hover:bg-brand-blue-700 text-white flex items-center gap-1.5 h-9 text-xs"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20 text-center">Sort Order</TableHead>
              <TableHead>Category Name</TableHead>
              <TableHead>URL Slug</TableHead>
              <TableHead className="text-center">Live / Active</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-slate-500">
                  <Layers className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  No categories found. Click &quot;Add Category&quot; to create one.
                </TableCell>
              </TableRow>
            ) : (
              categories.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="text-center font-mono font-bold text-xs text-slate-700">
                    {c.sort_order}
                  </TableCell>
                  <TableCell className="font-bold text-slate-900">{c.name}</TableCell>
                  <TableCell className="font-mono text-xs text-slate-500">{c.slug}</TableCell>
                  <TableCell className="text-center">
                    <Switch
                      checked={c.is_active}
                      onCheckedChange={(val) => handleToggle(c.id, val)}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="inline-flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingCategory(c)
                          setFormError(null)
                          setEditDialogOpen(true)
                        }}
                        className="h-8 w-8 p-0 text-slate-600 hover:text-brand-blue"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setDeletingId(c.id)
                          setDeleteDialogOpen(true)
                        }}
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit / Add Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCategory?.id ? 'Edit Category' : 'Create New Category'}
            </DialogTitle>
            <DialogDescription>
              Configure the category title, URL identifier, and display sequence.
            </DialogDescription>
          </DialogHeader>

          {formError && (
            <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-700 rounded-lg">
              {formError}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Name</label>
              <Input
                value={editingCategory?.name || ''}
                placeholder="e.g. Traditional Flours"
                onChange={(e) => {
                  const val = e.target.value
                  setEditingCategory((prev) => ({
                    ...prev,
                    name: val,
                    slug: prev?.id ? prev.slug : generateSlug(val),
                  }))
                }}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Slug</label>
              <Input
                value={editingCategory?.slug || ''}
                placeholder="traditional-flours"
                onChange={(e) =>
                  setEditingCategory((prev) => ({ ...prev, slug: e.target.value }))
                }
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Sort Order (Sequence)</label>
              <Input
                type="number"
                value={editingCategory?.sort_order ?? 0}
                onChange={(e) =>
                  setEditingCategory((prev) => ({
                    ...prev,
                    sort_order: parseInt(e.target.value) || 0,
                  }))
                }
                required
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-xs font-semibold text-slate-800">Active / Visible</span>
              <Switch
                checked={editingCategory?.is_active ?? true}
                onCheckedChange={(checked) =>
                  setEditingCategory((prev) => ({ ...prev, is_active: checked }))
                }
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditDialogOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-brand-blue hover:bg-brand-blue-700 text-white"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> Saving...
                  </>
                ) : (
                  'Save Category'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Category?</DialogTitle>
            <DialogDescription>
              Any products assigned to this category will become uncategorized.
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
              {isDeleting ? 'Deleting...' : 'Delete Category'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
