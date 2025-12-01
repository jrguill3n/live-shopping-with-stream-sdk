import { sql } from "@/lib/db"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StreamChatPanel } from "@/components/StreamChatPanel"
import { StreamLiveVideo } from "@/components/StreamLiveVideo"

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

function getStatusColor(status: ShowStatus): string {
  switch (status) {
    case "LIVE":
      return "bg-green-500 text-white"
    case "PLANNED":
      return "bg-blue-500 text-white"
    case "ENDED":
      return "bg-gray-500 text-white"
    default:
      return "bg-gray-500 text-white"
  }
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

  const formattedDate = new Date(show.scheduled_at).toLocaleString("en-US", {
    dateStyle: "full",
    timeStyle: "short",
  })

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Video Player Section */}
      <StreamLiveVideo showId={show.id} />

      {/* Two Column Layout: Chat & Products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Chat (2/3 width) */}
        <div className="lg:col-span-2">
          <StreamChatPanel showId={show.id} />
        </div>

        {/* Right Column: Products (1/3 width) */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Products</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">{show.title}</h3>
                <p className="text-sm text-muted-foreground">{show.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(show.status)}>{show.status}</Badge>
              </div>
              {show.status === "LIVE" && (
                <div className="pt-4">
                  <Button size="lg" className="w-full">
                    Join Live Show Now
                  </Button>
                </div>
              )}

              {show.status === "PLANNED" && (
                <div className="pt-4">
                  <Button size="lg" variant="secondary" className="w-full">
                    Set Reminder
                  </Button>
                </div>
              )}

              {show.status === "ENDED" && (
                <div className="pt-4">
                  <Button size="lg" variant="outline" className="w-full bg-transparent">
                    Watch Replay
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
