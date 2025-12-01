export async function addToCartForShow(showId: string, productId: string) {
  const res = await fetch("/api/cart", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ showId: Number.parseInt(showId), productId: Number.parseInt(productId) }),
  })
  if (!res.ok) {
    throw new Error("Failed to add to cart")
  }
  return res.json()
}
