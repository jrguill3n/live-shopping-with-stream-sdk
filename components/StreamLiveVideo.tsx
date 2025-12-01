"use client"

import { useEffect, useState } from "react"
import { StreamVideo, StreamVideoClient, StreamCall, CallContent } from "@stream-io/video-react-sdk"
import type { Call } from "@stream-io/video-react-sdk"
import "@stream-io/video-react-sdk/dist/css/styles.css"
import { getMockUser } from "@/lib/mockUser"

interface StreamLiveVideoProps {
  showId: number
}

export function StreamLiveVideo({ showId }: StreamLiveVideoProps) {
  const [videoClient, setVideoClient] = useState<StreamVideoClient | null>(null)
  const [call, setCall] = useState<Call | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    async function initializeVideo() {
      try {
        const user = getMockUser()

        // Fetch token from API
        const response = await fetch("/api/stream/token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id, userName: user.name }),
        })

        if (!response.ok) {
          throw new Error("Failed to get Stream token")
        }

        const { token, apiKey, userId, userName } = await response.json()

        if (!mounted) return

        // Create Stream Video client
        const client = new StreamVideoClient({
          apiKey,
          user: { id: userId, name: userName },
          token,
        })

        setVideoClient(client)

        // Create/join livestream call
        const streamCall = client.call("livestream", `show-${showId}`)
        await streamCall.join()

        if (!mounted) return

        setCall(streamCall)
        setLoading(false)
      } catch (err) {
        if (!mounted) return
        console.error("Error initializing Stream Video:", err)
        setError("Error joining stream")
        setLoading(false)
      }
    }

    initializeVideo()

    return () => {
      mounted = false
      if (call) {
        call.leave().catch(console.error)
      }
    }
  }, [showId])

  if (loading) {
    return (
      <div className="w-full h-[500px] rounded-xl bg-neutral-900 flex items-center justify-center text-neutral-200">
        Connecting to livestream...
      </div>
    )
  }

  if (error || !videoClient || !call) {
    return (
      <div className="w-full h-[500px] rounded-xl bg-neutral-900 flex items-center justify-center text-neutral-200">
        {error || "Error joining stream"}
      </div>
    )
  }

  return (
    <div className="w-full rounded-xl overflow-hidden">
      <StreamVideo client={videoClient}>
        <StreamCall call={call}>
          <CallContent />
        </StreamCall>
      </StreamVideo>
    </div>
  )
}
