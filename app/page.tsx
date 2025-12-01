import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { sql } from "@/lib/db"

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

export default async function HomePage() {
  const liveShows = await sql<LiveShow[]>`
    SELECT 
      id, 
      slug, 
      title, 
      description, 
      status, 
      scheduled_at,
      thumbnail_url
    FROM live_shows
    ORDER BY 
      CASE status
        WHEN 'LIVE' THEN 1
        WHEN 'PLANNED' THEN 2
        WHEN 'ENDED' THEN 3
      END,
      scheduled_at DESC
  `

  const isHostMode = true // Set to true to show host dashboard links

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-balance">Live Shopping Shows</h2>
        <p className="text-muted-foreground mt-2">Browse our collection of live shopping experiences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {liveShows.map((show) => (
          <Card key={show.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-xl">{show.title}</CardTitle>
                <Badge className={getStatusColor(show.status)}>{show.status}</Badge>
              </div>
              <CardDescription>{show.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1" />
            <CardFooter className="flex gap-2">
              <Button asChild className="flex-1">
                <Link href={`/shows/${show.slug}`}>{show.status === "LIVE" ? "Join Now" : "View Details"}</Link>
              </Button>
              {isHostMode && (
                <Button asChild variant="outline" className="flex-1 bg-transparent">
                  <Link href={`/host/shows/${show.slug}`}>Host Dashboard</Link>
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
