"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useHostChat } from "@/components/HostChatProvider"

interface Product {
  id: number
  name: string
  price_cents: number
  image_url: string | null
}

interface HostProductToolsProps {
  showId: string
  products: Product[]
}

export function HostProductTools({ showId, products }: HostProductToolsProps) {
  const { channel } = useHostChat()
  const [selectedProductId, setSelectedProductId] = useState<string | undefined>(products[0]?.id.toString())
  const [sending, setSending] = useState(false)

  const selectedProduct = products.find((p) => p.id.toString() === selectedProductId)

  const handleSendProduct = async () => {
    console.log("[v0] Send product clicked", { channel: !!channel, selectedProduct })

    if (!channel) {
      alert("Chat is not connected yet. Please wait and try again.")
      return
    }

    if (!selectedProduct) {
      alert("Please select a product first.")
      return
    }

    setSending(true)
    try {
      await channel.sendMessage({
        text: `🛍️ Check out: ${selectedProduct.name}`,
        customType: "product",
        productId: selectedProduct.id.toString(),
        productName: selectedProduct.name,
        productPriceCents: selectedProduct.price_cents,
        productImageUrl: selectedProduct.image_url,
        showId: showId,
      })

      console.log("[v0] Product sent successfully")
    } catch (err) {
      console.error("[v0] Error sending product:", err)
      alert("Failed to send product. Please try again.")
    } finally {
      setSending(false)
    }
  }

  if (!products.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Product Tools</CardTitle>
          <CardDescription>No products available</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No products have been added to this show yet.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Tools</CardTitle>
        <CardDescription>Send shoppable products to chat</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <label htmlFor="product-select" className="text-sm font-medium mb-2 block">
            Select a product
          </label>
          <select
            id="product-select"
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            {products.map((p) => (
              <option key={p.id} value={p.id.toString()}>
                {p.name} – ${(p.price_cents / 100).toFixed(2)}
              </option>
            ))}
          </select>
        </div>
        {!channel && <p className="text-xs text-muted-foreground">Waiting for chat to connect...</p>}
        <Button onClick={handleSendProduct} disabled={sending || !selectedProduct || !channel} className="w-full">
          {sending ? "Sending…" : "Send to Chat"}
        </Button>
      </CardContent>
    </Card>
  )
}
