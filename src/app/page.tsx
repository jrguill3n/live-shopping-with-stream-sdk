import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type ShowStatus = "PLANNED" | "LIVE" | "ENDED"

interface LiveShow {
  id: string
  slug: string
  title: string
  description: string
  status: ShowStatus
}

// Mock data for live shows
const liveShows: LiveShow[] = [
  {
    id: "1",
    slug: "tech-gadgets-showcase",
    title: "Tech Gadgets Showcase",
    description: "Discover the latest tech gadgets and innovative devices in this exciting live show.",
    status: "LIVE",
  },
  {
    id: "2",
    slug: "fashion-spring-collection",
    title: "Spring Fashion Collection",
    description: "Explore trendy spring outfits and fashion accessories with exclusive deals.",
    status: "PLANNED",
  },
  {
    id: "3",
    slug: "home-decor-essentials",
    title: "Home Decor Essentials",
    description: "Transform your living space with beautiful home decor items and furniture.",
    status: "PLANNED",
  },
  {
    id: "4",
    slug: "fitness-gear-special",
    title: "Fitness Gear Special",
    description: "Get fit with the best fitness equipment and workout gear at amazing prices.",
    status: "ENDED",
  },
]

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

export default function HomePage() {
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
            <CardFooter>
              <Button asChild className="w-full">
                <Link href={`/shows/${show.slug}`}>{show.status === "LIVE" ? "Join Now" : "View Details"}</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
