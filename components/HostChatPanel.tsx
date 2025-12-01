"use client"

import { Channel, ChannelHeader, MessageInput, Window, Thread } from "stream-chat-react"
import { ChatMessageList } from "@/components/ChatMessageList"
import { useHostChat } from "@/components/HostChatProvider"

export function HostChatPanel() {
  const { channel } = useHostChat()

  if (!channel) {
    return null
  }

  return (
    <div className="h-96 rounded-lg overflow-hidden border">
      <Channel channel={channel}>
        <Window>
          <ChannelHeader />
          <ChatMessageList />
          <MessageInput />
        </Window>
        <Thread />
      </Channel>
    </div>
  )
}
