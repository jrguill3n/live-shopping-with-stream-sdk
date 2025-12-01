import { notFound } from "next/navigation"
import { sql } from "@/lib/db"
import { HostBroadcastPanel } from "@/components/HostBroadcastPanel"
import { StreamChatPanel } from "@/components/StreamChatPanel"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type ShowStatus = "PLANNED" | "LIVE" | "ENDED"

interface LiveShow {
  id: number
  slug: string
  title: string
  description: string
  status: ShowStatus
  scheduled_at: string
  host_id: number
}

interface PageProps {
  params: Promise<{ slug: string }>
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

export default async function HostDashboardPage({ params }: PageProps) {
  const { slug } = await params

  const shows = await sql<LiveShow[]>`
    SELECT 
      id, 
      slug, 
      title, 
      description, 
      status, 
      scheduled_at,
      host_id
    FROM live_shows
    WHERE slug = ${slug}
  `

  if (shows.length === 0) {
    notFound()
  }

  const show = shows[0]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-balance">Host Dashboard – {show.title}</h1>
          <p className="text-muted-foreground mt-2">Control your livestream and interact with viewers</p>
        </div>
        <Badge className={getStatusColor(show.status)}>{show.status}</Badge>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Broadcast Panel */}
        <div className="lg:col-span-2">
          <HostBroadcastPanel showId={show.id.toString()} showTitle={show.title} />
        </div>

        {/* Right: Chat + Info */}
        <div className="space-y-6">
          {/* Quick Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>Show Information</CardTitle>
              <CardDescription>Quick stats and details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Description</p>
                <p className="text-sm mt-1">{show.description}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Scheduled At</p>
                <p className="text-sm mt-1">{new Date(show.scheduled_at).toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>

          {/* Chat Panel */}
          <Card>
            <CardHeader>
              <CardTitle>Live Chat</CardTitle>
              <CardDescription>Interact with your viewers</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <StreamChatPanel showId={show.id} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
