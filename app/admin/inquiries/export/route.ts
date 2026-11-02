import { createClient } from "@/lib/supabase/server"
import { isSupabaseConfigured } from "@/lib/supabase/public"
import { getInquiries } from "@/lib/data/inquiries"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    if (isSupabaseConfigured()) {
      const supabase = await createClient()
      const { data: ok } = await supabase.rpc("is_admin")
      if (!ok) return new Response("Forbidden", { status: 403 })
    }

    const data = await getInquiries()

    const cols = [
      "created_at",
      "inquiry_type",
      "status",
      "full_name",
      "email",
      "phone",
      "business_name",
      "country",
      "city",
      "import_license_status",
      "estimated_order_volume",
      "product_interest",
      "message",
    ]

    const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`
    const csv = [
      cols.join(","),
      ...(data ?? []).map((r) =>
        cols.map((c) => esc((r as unknown as Record<string, unknown>)[c])).join(",")
      ),
    ].join("\n")

    return new Response("\uFEFF" + csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="megh-inquiries-${new Date()
          .toISOString()
          .slice(0, 10)}.csv"`,
      },
    })
  } catch {
    return new Response("Internal error generating export", { status: 500 })
  }
}
