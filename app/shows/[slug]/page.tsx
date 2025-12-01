import { sql } from "@/lib/db"
import { notFound } from "next/navigation"
import { StreamChatPanel } from "@/components/StreamChatPanel"
import { StreamLiveVideo } from "@/components/StreamLiveVideo"
import { ViewerSidebar } from "@/components/ViewerSidebar"

interface ShowPageProps {
  params: Promise<{
    slug: string
  }>
}

type ShowStatus = "PLANNED" | "LIVE" | "ENDED"

interface LiveShow {
  id: number
  slug: string
  title: string
  description: string
  status: ShowStatus
  scheduled_at: string
  thumbnail_url: string
}

interface Product {
  id: number
  sku: string
  name: string
  description: string | null
  image_url: string | null
  price_cents: number
  currency: string
  featured: boolean
}

export default async function ShowPage({ params }: ShowPageProps) {
  const { slug } = await params

  const shows = await sql<LiveShow[]>`
    SELECT 
      id, 
      slug, 
      title, 
      description, 
      status, 
      scheduled_at,
      thumbnail_url
    FROM live_shows
    WHERE slug = ${slug}
    LIMIT 1
  `

  const show = shows[0]

  if (!show) {
    notFound()
  }

  const products = await sql<Product[]>`
    SELECT 
      p.id,
      p.sku,
      p.name,
      p.description,
      p.image_url,
      p.price_cents,
      p.currency,
      sp.featured
    FROM products p
    JOIN show_products sp ON p.id = sp.product_id
    WHERE sp.show_id = ${show.id} AND p.active = true
    ORDER BY sp.sort_order ASC, p.name ASC
  `

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Video Player Section */}
      <StreamLiveVideo showId={show.id} />

      {/* Two Column Layout: Chat & Products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Chat (2/3 width) */}
        <div className="lg:col-span-2">
          <StreamChatPanel showId={show.id} />
        </div>

        {/* Right Column: Products & Cart (1/3 width) */}
        <div className="lg:col-span-1">
          <ViewerSidebar showId={show.id} products={products} />
        </div>
      </div>
    </div>
  )
}
