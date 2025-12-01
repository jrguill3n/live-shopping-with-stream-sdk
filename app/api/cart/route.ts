import { sql } from "@/lib/db"
import { getMockUser } from "@/lib/mockUser"
import { type NextRequest, NextResponse } from "next/server"

interface CartItem {
  id: number
  productId: number
  name: string
  priceCentsSnapshot: number
  quantity: number
  imageUrl: string
}

interface CartResponse {
  cartId: number | null
  items: CartItem[]
  subtotalCents: number
}

export async function GET(request: NextRequest) {
  try {
    const user = getMockUser()
    const searchParams = request.nextUrl.searchParams
    const showId = searchParams.get("showId")

    if (!showId) {
      return NextResponse.json({ error: "showId is required" }, { status: 400 })
    }

    // Find active cart for user + show
    const carts = await sql`
      SELECT id, user_id, show_id, active, created_at, updated_at
      FROM carts
      WHERE user_id = ${user.id} 
        AND show_id = ${Number.parseInt(showId)}
        AND active = true
      LIMIT 1
    `

    if (carts.length === 0) {
      return NextResponse.json<CartResponse>({
        cartId: null,
        items: [],
        subtotalCents: 0,
      })
    }

    const cart = carts[0]

    // Get cart items with product details
    const items = await sql`
      SELECT 
        ci.id,
        ci.product_id,
        p.name,
        p.image_url,
        ci.price_cents_snapshot,
        ci.quantity
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.cart_id = ${cart.id}
      ORDER BY ci.id
    `

    const cartItems: CartItem[] = items.map((item: any) => ({
      id: item.id,
      productId: item.product_id,
      name: item.name,
      imageUrl: item.image_url,
      priceCentsSnapshot: item.price_cents_snapshot,
      quantity: item.quantity,
    }))

    const subtotalCents = cartItems.reduce((sum, item) => sum + item.priceCentsSnapshot * item.quantity, 0)

    return NextResponse.json<CartResponse>({
      cartId: cart.id,
      items: cartItems,
      subtotalCents,
    })
  } catch (error) {
    console.error("GET /api/cart error:", error)
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getMockUser()
    const body = await request.json()
    const { showId, productId } = body

    if (!showId || !productId) {
      return NextResponse.json({ error: "showId and productId are required" }, { status: 400 })
    }

    // Get product to read current price
    const products = await sql`
      SELECT id, sku, name, price_cents, active
      FROM products
      WHERE id = ${Number.parseInt(productId)} AND active = true
      LIMIT 1
    `

    if (products.length === 0) {
      return NextResponse.json({ error: "Product not found or inactive" }, { status: 404 })
    }

    const product = products[0]

    // Find or create cart
    const carts = await sql`
      SELECT id, user_id, show_id, active
      FROM carts
      WHERE user_id = ${user.id} 
        AND show_id = ${Number.parseInt(showId)}
        AND active = true
      LIMIT 1
    `

    let cartId: number

    if (carts.length === 0) {
      // Create new cart
      const newCarts = await sql`
        INSERT INTO carts (user_id, show_id, active)
        VALUES (${user.id}, ${Number.parseInt(showId)}, true)
        RETURNING id
      `
      cartId = newCarts[0].id
    } else {
      cartId = carts[0].id
    }

    // Check if cart item exists
    const existingItems = await sql`
      SELECT id, quantity
      FROM cart_items
      WHERE cart_id = ${cartId} AND product_id = ${Number.parseInt(productId)}
      LIMIT 1
    `

    if (existingItems.length > 0) {
      // Increment quantity
      await sql`
        UPDATE cart_items
        SET quantity = quantity + 1
        WHERE id = ${existingItems[0].id}
      `
    } else {
      // Create new cart item
      await sql`
        INSERT INTO cart_items (cart_id, product_id, quantity, price_cents_snapshot)
        VALUES (${cartId}, ${Number.parseInt(productId)}, 1, ${product.price_cents})
      `
    }

    // Return updated cart
    const items = await sql`
      SELECT 
        ci.id,
        ci.product_id,
        p.name,
        p.image_url,
        ci.price_cents_snapshot,
        ci.quantity
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.cart_id = ${cartId}
      ORDER BY ci.id
    `

    const cartItems: CartItem[] = items.map((item: any) => ({
      id: item.id,
      productId: item.product_id,
      name: item.name,
      imageUrl: item.image_url,
      priceCentsSnapshot: item.price_cents_snapshot,
      quantity: item.quantity,
    }))

    const subtotalCents = cartItems.reduce((sum, item) => sum + item.priceCentsSnapshot * item.quantity, 0)

    return NextResponse.json<CartResponse>({
      cartId,
      items: cartItems,
      subtotalCents,
    })
  } catch (error) {
    console.error("POST /api/cart error:", error)
    return NextResponse.json({ error: "Failed to add item to cart" }, { status: 500 })
  }
}
