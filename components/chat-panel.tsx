"use client"
import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { SyncChannel } from "@/lib/ws-client"

type ChatMsg = { user: string; text: string; ts: number }

export default function ChatPanel({
  roomId,
  username,
  channel,
}: { roomId: string; username: string; channel: SyncChannel }) {
  const [msgs, setMsgs] = useState<ChatMsg[]>([])
  const [text, setText] = useState("")
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [msgs])

  function send() {
    if (!text.trim()) return
    const m: ChatMsg = { user: username, text, ts: Date.now() }
    setMsgs((prev) => [...prev, m])
    channel.send({ type: "chat", text: m.text, user: m.user, ts: m.ts })
    setText("")
  }

  // Receive chat broadcasts for this room
  useEffect(() => {
    const eventName = `wp_chat_${roomId}`
    const onChat = (e: Event) => {
      const ce = e as CustomEvent
      const { user, text, ts } = ce.detail as ChatMsg
      setMsgs((prev) => [...prev, { user, text, ts }])
    }
    window.addEventListener(eventName, onChat as any)
    return () => window.removeEventListener(eventName, onChat as any)
  }, [roomId])

  return (
    <Card className="h-full">
      <CardHeader className="py-3">
        <CardTitle className="text-sm">Live Chat</CardTitle>
      </CardHeader>
      <CardContent className="grid h-[420px] grid-rows-[1fr_auto] gap-2">
        <ScrollArea className="pr-2">
          <ul className="space-y-2">
            {msgs.map((m, idx) => (
              <li key={idx}>
                <span className="text-xs text-muted-foreground">{new Date(m.ts).toLocaleTimeString()} • </span>
                <span className="font-medium">{m.user}:</span> <span>{m.text}</span>
              </li>
            ))}
          </ul>
          <div ref={endRef} />
        </ScrollArea>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Type a message"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") send()
            }}
          />
          <Button onClick={send}>Send</Button>
        </div>
      </CardContent>
    </Card>
  )
}
const { data, error } = await supabase
  .from("posts")
  .insert([{ title: "My Meme", image_url: imageUrl }]);
