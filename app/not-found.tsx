import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Home, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 bg-blue-50 text-brand-blue rounded-3xl mx-auto flex items-center justify-center font-black text-3xl shadow-sm border border-blue-100">
          404
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Page Not Found
          </h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            Sorry, we couldn&apos;t find the page or item you&apos;re looking for. It may have been moved or is currently unavailable.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button asChild size="default" className="rounded-xl w-full sm:w-auto">
            <Link href="/" className="flex items-center gap-2">
              <Home className="w-4 h-4" /> Go to Homepage
            </Link>
          </Button>
          <Button asChild variant="outline" size="default" className="rounded-xl w-full sm:w-auto border-slate-300">
            <Link href="/products" className="flex items-center gap-2">
              <Search className="w-4 h-4" /> Browse Catalog
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

