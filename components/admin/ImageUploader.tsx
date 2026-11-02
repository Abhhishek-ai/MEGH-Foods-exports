'use client'

import React, { useState, useRef } from 'react'
import Image from 'next/image'
import imageCompression from 'browser-image-compression'
import { createClient } from '@/lib/supabase/client'
import { UploadCloud, X, ArrowLeft, ArrowRight, Loader2, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

export async function uploadProductImage(file: File): Promise<string> {
  const supabase = createClient()
  const webp = await imageCompression(file, {
    maxSizeMB: 0.4,
    maxWidthOrHeight: 1600,
    useWebWorker: true,
    fileType: 'image/webp',
  })
  const path = `products/${crypto.randomUUID()}.webp`
  const { error } = await supabase.storage.from('product-images').upload(path, webp, {
    contentType: 'image/webp',
    cacheControl: '31536000',
    upsert: false,
  })
  if (error) throw error
  return supabase.storage.from('product-images').getPublicUrl(path).data.publicUrl
}

export async function removeProductImage(url: string) {
  const path = url.split('/product-images/')[1]
  if (!path) return
  await createClient().storage.from('product-images').remove([path])
}

interface ImageUploaderProps {
  value: string[]
  onChange: (urls: string[]) => void
  disabled?: boolean
}

export function ImageUploader({ value = [], onChange, disabled = false }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    setErrorMsg(null)

    if (value.length + files.length > 10) {
      setErrorMsg('You can upload a maximum of 10 images per product.')
      return
    }

    setIsUploading(true)
    const newUrls: string[] = []

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        if (!file.type.match(/^image\/(jpeg|png|webp)$/i)) {
          throw new Error(`File ${file.name} must be JPG, PNG, or WebP.`)
        }
        const uploadedUrl = await uploadProductImage(file)
        newUrls.push(uploadedUrl)
      }
      onChange([...value, ...newUrls])
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Upload failed. Please try again.')
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleRemove = async (indexToRemove: number) => {
    const urlToRemove = value[indexToRemove]
    const next = value.filter((_, i) => i !== indexToRemove)
    onChange(next)
    try {
      await removeProductImage(urlToRemove)
    } catch {
      // Storage cleanup failure does not block form save
    }
  }

  const handleMove = (index: number, direction: 'left' | 'right') => {
    const targetIndex = direction === 'left' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= value.length) return
    const next = [...value]
    const temp = next[index]
    next[index] = next[targetIndex]
    next[targetIndex] = temp
    onChange(next)
  }

  return (
    <div className="space-y-4">
      {/* Upload Dropzone */}
      <div
        onClick={() => !disabled && !isUploading && fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault()
          if (!disabled && !isUploading) handleFiles(e.dataTransfer.files)
        }}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
          disabled || isUploading
            ? 'opacity-50 cursor-not-allowed bg-slate-50'
            : 'border-slate-300 hover:border-brand-blue hover:bg-blue-50/30'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          disabled={disabled || isUploading}
          onChange={(e) => handleFiles(e.target.files)}
        />
        <div className="flex flex-col items-center justify-center space-y-2">
          {isUploading ? (
            <>
              <Loader2 className="w-8 h-8 text-brand-blue animate-spin" />
              <p className="text-xs font-semibold text-slate-700">
                Compressing &amp; uploading WebP images...
              </p>
            </>
          ) : (
            <>
              <UploadCloud className="w-8 h-8 text-slate-400" />
              <p className="text-xs font-semibold text-slate-700">
                Click or drag &amp; drop product pack shots here
              </p>
              <p className="text-[11px] text-slate-400">
                JPG, PNG, WebP up to 5MB (Auto-compressed to high-efficiency WebP)
              </p>
            </>
          )}
        </div>
      </div>

      {errorMsg && (
        <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200">
          {errorMsg}
        </p>
      )}

      {/* Thumbnails Grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {value.map((url, index) => (
            <div
              key={url}
              className="group relative border rounded-xl overflow-hidden bg-slate-50 aspect-square flex items-center justify-center shadow-sm"
            >
              <Image
                src={url}
                alt={`Product image ${index + 1}`}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-contain p-2"
              />

              {index === 0 && (
                <span className="absolute top-2 left-2 z-10 bg-brand-blue text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                  Cover
                </span>
              )}

              {/* Action Overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemove(index)
                    }}
                    className="p-1 rounded-full bg-red-600 text-white hover:bg-red-700 shadow"
                    title="Remove image"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex justify-between items-center bg-black/60 rounded-md p-1">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleMove(index, 'left')
                    }}
                    className="p-1 text-white hover:text-brand-lime disabled:opacity-30"
                    title="Move left"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[10px] text-white font-mono">
                    {index + 1}/{value.length}
                  </span>
                  <button
                    type="button"
                    disabled={index === value.length - 1}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleMove(index, 'right')
                    }}
                    className="p-1 text-white hover:text-brand-lime disabled:opacity-30"
                    title="Move right"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
