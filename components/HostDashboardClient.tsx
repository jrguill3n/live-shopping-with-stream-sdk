"use client"

import { HostChatProvider } from "./HostChatProvider"
import { HostProductTools } from "./HostProductTools"
import { HostChatPanel } from "./HostChatPanel"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"

interface Product {
  id: number
  name: string
  price_cents: number
  image_url: string | null
}

interface LiveShow {
  id: number
  title: string
  description: string
  scheduled_at: string
}

interface HostDashboardClientProps {
  show: LiveShow
  products: Product[]
}

export function HostDashboardClient({ show, products }: HostDashboardClientProps) {
  return (
    <HostChatProvider showId={show.id}>
      <div className="space-y-6">
        {/* Host Product Tools */}
        <HostProductTools showId={show.id.toString()} products={products} />

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
            <HostChatPanel />
          </CardContent>
        </Card>
      </div>
    </HostChatProvider>
  )
}
