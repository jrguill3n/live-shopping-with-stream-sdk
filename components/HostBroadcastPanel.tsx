"use client"

import { useEffect, useState } from "react"
import { StreamVideo, StreamVideoClient, type Call, StreamCall } from "@stream-io/video-react-sdk"
import "@stream-io/video-react-sdk/dist/css/styles.css"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface HostBroadcastPanelProps {
  showId: string
  showTitle: string
}

export function HostBroadcastPanel({ showId, showTitle }: HostBroadcastPanelProps) {
  const [videoClient, setVideoClient] = useState<StreamVideoClient | null>(null)
  const [call, setCall] = useState<Call | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isInStudio, setIsInStudio] = useState(false)
  const [isLive, setIsLive] = useState(false)

  useEffect(() => {
    const initVideo = async () => {
      try {
        // Use host user ID
        const hostUserId = "host_1"
        const hostUserName = "Host"

        // Get token from API
        const response = await fetch("/api/stream/token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: hostUserId,
            userName: hostUserName,
          }),
        })

        if (!response.ok) {
          throw new Error("Failed to get Stream token")
        }

        const { token, apiKey } = await response.json()

        if (!apiKey || !token) {
          throw new Error("Stream credentials not available")
        }

        // Initialize Stream Video client
        const client = new StreamVideoClient({
          apiKey,
          user: {
            id: hostUserId,
            name: hostUserName,
          },
          token,
        })

        // Create call
        const callId = `show-${showId}`
        const videoCall = client.call("livestream", callId)

        setVideoClient(client)
        setCall(videoCall)
        setLoading(false)
      } catch (err) {
        console.error("Error initializing Stream Video:", err)
        setError(err instanceof Error ? err.message : "Failed to load video")
        setLoading(false)
      }
    }

    initVideo()

    // Cleanup on unmount
    return () => {
      if (call) {
        call.leave().catch(console.error)
      }
    }
  }, [showId])

  const handleJoinStudio = async () => {
    if (!call) return
    try {
      await call.join({ create: true })
      await call.camera.enable()
      await call.microphone.enable()
      setIsInStudio(true)
    } catch (err) {
      console.error("Error joining studio:", err)
      alert("Failed to join studio. Please try again.")
    }
  }

  const handleGoLive = async () => {
    if (!call) return
    try {
      await call.goLive()
      setIsLive(true)
    } catch (err) {
      console.error("Error going live:", err)
      alert("Failed to go live. Please try again.")
    }
  }

  const handleEndStream = async () => {
    if (!call) return
    try {
      await call.stopLive()
      setIsLive(false)
    } catch (err) {
      console.error("Error ending stream:", err)
      alert("Failed to end stream. Please try again.")
    }
  }

  const handleLeaveStudio = async () => {
    if (!call) return
    try {
      await call.leave()
      setIsInStudio(false)
      setIsLive(false)
    } catch (err) {
      console.error("Error leaving studio:", err)
      alert("Failed to leave studio. Please try again.")
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Broadcast Studio</CardTitle>
          <CardDescription>Loading broadcast controls...</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">Initializing video...</p>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Broadcast Studio</CardTitle>
          <CardDescription className="text-destructive">{error}</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-96">
          <div className="text-center">
            <p className="text-destructive font-semibold mb-2">Error loading broadcast</p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!videoClient || !call) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Broadcast Studio</CardTitle>
            <CardDescription>Control your livestream for "{showTitle}"</CardDescription>
          </div>
          {isLive && <Badge className="bg-red-500 text-white animate-pulse">LIVE</Badge>}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Video Preview */}
        <div className="bg-black rounded-lg overflow-hidden aspect-video flex items-center justify-center">
          <StreamVideo client={videoClient}>
            <StreamCall call={call}>
              {isInStudio ? (
                <div className="w-full h-full flex items-center justify-center text-white">
                  <div className="text-center">
                    <div className="text-6xl mb-4">📹</div>
                    <p className="text-lg font-semibold">You're in the studio!</p>
                    <p className="text-sm text-gray-300 mt-2">Camera and microphone are enabled</p>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🎥</div>
                    <p className="text-lg font-semibold">Ready to broadcast</p>
                    <p className="text-sm text-gray-300 mt-2">Join the studio to start your stream</p>
                  </div>
                </div>
              )}
            </StreamCall>
          </StreamVideo>
        </div>

        {/* Control Buttons */}
        <div className="flex gap-2">
          {!isInStudio ? (
            <Button onClick={handleJoinStudio} className="flex-1">
              Join Studio
            </Button>
          ) : (
            <>
              {!isLive ? (
                <Button onClick={handleGoLive} className="flex-1 bg-green-600 hover:bg-green-700">
                  Go Live
                </Button>
              ) : (
                <Button onClick={handleEndStream} className="flex-1 bg-red-600 hover:bg-red-700">
                  End Stream
                </Button>
              )}
              <Button onClick={handleLeaveStudio} variant="outline" className="flex-1 bg-transparent">
                Leave Studio
              </Button>
            </>
          )}
        </div>

        {/* Status Messages */}
        <div className="text-sm text-muted-foreground">
          {isInStudio && !isLive && <p>✓ Studio ready. Click "Go Live" to start broadcasting to viewers.</p>}
          {isLive && <p className="text-green-600 font-semibold">✓ You are now LIVE! Viewers can watch your stream.</p>}
        </div>
      </CardContent>
    </Card>
  )
}
