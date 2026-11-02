'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock, AlertCircle } from "lucide-react"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const { error: signInErr } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInErr) {
        setError(signInErr.message)
        setLoading(false)
        return
      }

      // Check admin status
      const { data: isAdmin, error: rpcErr } = await supabase.rpc("is_admin")
      if (rpcErr || !isAdmin) {
        await supabase.auth.signOut()
        setError("Access denied: This account is not registered as an administrator.")
        setLoading(false)
        return
      }

      router.push("/admin")
      router.refresh()
    } catch {
      setError("An unexpected error occurred. Please check your credentials.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <Card className="w-full max-w-md shadow-lg border-slate-200">
        <CardHeader className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-brand-blue text-white flex items-center justify-center mx-auto shadow-md">
            <Lock className="w-6 h-6" />
          </div>
          <CardTitle className="text-2xl font-black text-brand-blue">
            Megh Foods Admin
          </CardTitle>
          <CardDescription className="text-xs">
            Sign in with authorized administrator credentials
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700" htmlFor="admin-email">
                Email Address
              </label>
              <Input
                id="admin-email"
                type="email"
                placeholder="owner@meghfoods.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700" htmlFor="admin-password">
                Password
              </label>
              <Input
                id="admin-password"
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-blue hover:bg-brand-blue-700 text-white font-semibold"
            >
              {loading ? "Verifying..." : "Sign In to Admin Portal"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
