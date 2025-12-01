"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ShoppingCart, Plus } from "lucide-react"

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

interface CartItem {
  id: number
  productId: number
  name: string
  priceCentsSnapshot: number
  quantity: number
  imageUrl: string
}

interface CartData {
  cartId: number | null
  items: CartItem[]
  subtotalCents: number
}

interface ViewerSidebarProps {
  showId: number
  products: Product[]
}

export function ViewerSidebar({ showId, products }: ViewerSidebarProps) {
  const [cart, setCart] = useState<CartData>({
    cartId: null,
    items: [],
    subtotalCents: 0,
  })
  const [loading, setLoading] = useState(true)
  const [addingToCart, setAddingToCart] = useState<number | null>(null)

  // Load cart on mount
  useEffect(() => {
    loadCart()
  }, [showId])

  const loadCart = async () => {
    try {
      const response = await fetch(`/api/cart?showId=${showId}`)
      if (response.ok) {
        const data = await response.json()
        setCart(data)
      }
    } catch (error) {
      console.error("Failed to load cart:", error)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = async (productId: number) => {
    setAddingToCart(productId)
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ showId, productId }),
      })

      if (response.ok) {
        const data = await response.json()
        setCart(data)
      }
    } catch (error) {
      console.error("Failed to add to cart:", error)
    } finally {
      setAddingToCart(null)
    }
  }

  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`
  }

  return (
    <div className="space-y-6">
      {/* Products Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Products
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {products.length === 0 ? (
            <p className="text-sm text-muted-foreground">No products available for this show.</p>
          ) : (
            products.map((product) => (
              <div key={product.id} className="flex gap-3 p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                <img
                  src={product.image_url || "/placeholder.svg?height=80&width=80"}
                  alt={product.name}
                  className="w-20 h-20 object-cover rounded-md"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-semibold text-sm leading-tight">
                      {product.name}
                      {product.featured && (
                        <Badge className="ml-2 text-xs" variant="secondary">
                          Featured
                        </Badge>
                      )}
                    </h4>
                  </div>
                  {product.description && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{product.description}</p>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-bold text-sm">{formatPrice(product.price_cents)}</span>
                    <Button size="sm" onClick={() => addToCart(product.id)} disabled={addingToCart === product.id}>
                      <Plus className="h-4 w-4 mr-1" />
                      {addingToCart === product.id ? "Adding..." : "Add"}
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Cart Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Cart</span>
            {cart.items.length > 0 && <Badge variant="secondary">{cart.items.length}</Badge>}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading cart...</p>
          ) : cart.items.length === 0 ? (
            <p className="text-sm text-muted-foreground">Your cart is empty</p>
          ) : (
            <>
              <div className="space-y-3">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <img
                      src={item.imageUrl || "/placeholder.svg?height=40&width=40"}
                      alt={item.name}
                      className="w-10 h-10 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium leading-tight">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Qty: {item.quantity} × {formatPrice(item.priceCentsSnapshot)}
                      </p>
                    </div>
                    <span className="text-sm font-semibold">
                      {formatPrice(item.priceCentsSnapshot * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
              <Separator />
              <div className="flex items-center justify-between text-base font-bold">
                <span>Subtotal</span>
                <span>{formatPrice(cart.subtotalCents)}</span>
              </div>
              <Button className="w-full" size="lg" disabled>
                Checkout (Coming Soon)
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
