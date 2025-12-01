"use client"

import { useEffect, useState } from "react"
import { StreamChat } from "stream-chat"
import { Chat, Channel, ChannelHeader, MessageList, MessageInput, Window, Thread } from "stream-chat-react"
import { getMockUser } from "@/lib/mockUser"
import "stream-chat-react/dist/css/v2/index.css"

interface StreamChatPanelProps {
  showId: number
}

export function StreamChatPanel({ showId }: StreamChatPanelProps) {
  const [client, setClient] = useState<StreamChat | null>(null)
  const [channel, setChannel] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const initChat = async () => {
      try {
        const user = getMockUser()

        // Get token from API
        const response = await fetch("/api/stream/token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.streamUserId,
            userName: user.name,
          }),
        })

        if (!response.ok) {
          throw new Error("Failed to get Stream token")
        }

        const { token, apiKey } = await response.json()

        if (!apiKey) {
          throw new Error("Stream API key not available")
        }

        // Initialize Stream client
        const chatClient = StreamChat.getInstance(apiKey)

        // Connect user
        await chatClient.connectUser(
          {
            id: user.streamUserId,
            name: user.name,
          },
          token,
        )

        // Create or watch channel
        const channelId = `show-${showId}`
        const chatChannel = chatClient.channel("livestream", channelId, {
          name: `Show ${showId} Chat`,
        })

        await chatChannel.watch()

        setClient(chatClient)
        setChannel(chatChannel)
        setLoading(false)
      } catch (err) {
        console.error("Error initializing Stream Chat:", err)
        setError(err instanceof Error ? err.message : "Failed to load chat")
        setLoading(false)
      }
    }

    initChat()

    // Cleanup on unmount
    return () => {
      if (client) {
        client.disconnectUser()
      }
    }
  }, [showId])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 bg-muted rounded-lg">
        <p className="text-muted-foreground">Loading chat...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96 bg-muted rounded-lg">
        <div className="text-center">
          <p className="text-destructive font-semibold mb-2">Error loading chat</p>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    )
  }

  if (!client || !channel) {
    return null
  }

  return (
    <div className="h-96 rounded-lg overflow-hidden border">
      <Chat client={client} theme="str-chat__theme-light">
        <Channel channel={channel}>
          <Window>
            <ChannelHeader />
            <MessageList />
            <MessageInput />
          </Window>
          <Thread />
        </Channel>
      </Chat>
    </div>
  )
}
