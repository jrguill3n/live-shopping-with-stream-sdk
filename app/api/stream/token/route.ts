import { type NextRequest, NextResponse } from "next/server"
import { StreamChat } from "stream-chat"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, userName } = body

    if (!userId || !userName) {
      return NextResponse.json({ error: "userId and userName are required" }, { status: 400 })
    }

    const apiKey = process.env.STREAM_API_KEY
    const apiSecret = process.env.STREAM_SECRET

    if (!apiKey || !apiSecret) {
      return NextResponse.json({ error: "Stream API credentials not configured" }, { status: 500 })
    }

    // Initialize Stream server client
    const serverClient = StreamChat.getInstance(apiKey, apiSecret)

    // Upsert user in Stream
    await serverClient.upsertUser({
      id: userId,
      name: userName,
    })

    // Generate token for the user
    const token = serverClient.createToken(userId)

    return NextResponse.json({
      token,
      apiKey,
      userId,
      userName,
    })
  } catch (error) {
    console.error("Error generating Stream token:", error)
    return NextResponse.json({ error: "Failed to generate token" }, { status: 500 })
  }
}
