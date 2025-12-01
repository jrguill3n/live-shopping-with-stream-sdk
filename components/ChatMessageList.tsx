"use client"

import { MessageList, useMessageContext } from "stream-chat-react"
import { useState } from "react"
import { addToCartForShow } from "@/lib/cartClient"
import { Button } from "@/components/ui/button"

function ProductMessageCard() {
  const { message } = useMessageContext()
  const [loading, setLoading] = useState(false)
  const [added, setAdded] = useState(false)

  const productId = (message as any).productId as string | undefined
  const productName = (message as any).productName as string | undefined
  const productPriceCents = (message as any).productPriceCents as number | undefined
  const productImageUrl = (message as any).productImageUrl as string | undefined
  const showId = (message as any).showId as string | undefined

  // If not a product message, render normally
  if (!productId || !productName || !productPriceCents) {
    return null
  }

  const handleAddToCart = async () => {
    if (!showId) return
    setLoading(true)
    try {
      await addToCartForShow(showId, productId)
      setAdded(true)
      setTimeout(() => setAdded(false), 2000)
    } catch (err) {
      console.error("Error adding to cart:", err)
      alert("Failed to add to cart. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="my-2 flex gap-3 rounded-lg border bg-card p-3 shadow-sm max-w-sm">
      {productImageUrl && (
        <img
          src={productImageUrl || "/placeholder.svg"}
          alt={productName}
          className="h-20 w-20 flex-shrink-0 rounded-md object-cover"
        />
      )}
      <div className="flex-1 space-y-2">
        <div>
          <div className="text-sm font-semibold">{productName}</div>
          <div className="text-sm font-bold text-green-600">${(productPriceCents / 100).toFixed(2)}</div>
        </div>
        <Button
          onClick={handleAddToCart}
          disabled={loading || added}
          size="sm"
          className="w-full"
          variant={added ? "secondary" : "default"}
        >
          {loading ? "Adding…" : added ? "✓ Added!" : "Add to Cart"}
        </Button>
      </div>
    </div>
  )
}

export function ChatMessageList() {
  return (
    <MessageList
      Message={(messageProps) => {
        const { message } = messageProps
        const isProductMessage = !!(message as any).productId

        if (isProductMessage) {
          return (
            <div className="str-chat__message str-chat__message--regular">
              <ProductMessageCard />
            </div>
          )
        }

        // Render default message
        return <MessageList.Message {...messageProps} />
      }}
    />
  )
}
