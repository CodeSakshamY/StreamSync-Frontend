"use client"
import { useEffect, useRef, useState } from "react"
import Navbar from "@/components/navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { SyncChannel } from "@/lib/ws-client"
import PlayerSync from "@/components/player-sync"
import ChatPanel from "@/components/chat-panel"

export default function Page() {
  const [roomId, setRoomId] = useState("")
  const [username, setUsername] = useState("")
  const [joined, setJoined] = useState(false)
  const [channel, setChannel] = useState<SyncChannel | null>(null)

  const bindHandlerRef = useRef<(msg: any) => void>(() => {})

  const joinRoom = () => {
    if (!roomId.trim() || !username.trim()) return
    const ch = new SyncChannel(roomId.trim(), (msg) => {
      if (msg.type === "chat") {
        window.dispatchEvent(new CustomEvent(`wp_chat_${roomId}`, { detail: msg }))
      }
      bindHandlerRef.current?.(msg)
    })
    setChannel(ch)
    setJoined(true)
  }

  const createRoom = () => {
    const id = Math.random().toString(36).slice(2, 8)
    setRoomId(id)
  }

  useEffect(() => {
    return () => channel?.close()
  }, [channel])

  return (
    <main>
      <Navbar />
      {!joined ? (
        <section className="mx-auto max-w-2xl px-4 py-8">
          <Card>
            <CardHeader>
              <CardTitle>Join a Watch Party</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="room">Room ID</Label>
                <div className="flex gap-2">
                  <Input
                    id="room"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    placeholder="e.g. abc123"
                  />
                  <Button variant="outline" onClick={createRoom}>
                    Create
                  </Button>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="name">Your name</Label>
                <Input id="name" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Jane" />
              </div>
              <div className="flex justify-end">
                <Button onClick={joinRoom} disabled={!roomId || !username}>
                  Join Room
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Real-time sync uses WebSockets if NEXT_PUBLIC_WS_URL is set; otherwise falls back to same-device
                BroadcastChannel for demo.
              </p>
            </CardContent>
          </Card>
        </section>
      ) : (
        <section className="mx-auto grid max-w-6xl gap-6 px-4 py-6 md:grid-cols-[2fr_1fr]">
          {channel && (
            <>
              <div className="grid gap-4">
                <PlayerSync
                  roomId={roomId}
                  username={username}
                  channel={channel}
                  onBindChannel={(fn) => {
                    bindHandlerRef.current = fn
                  }}
                />
              </div>
              <div className="grid gap-4">
                <ChatPanel roomId={roomId} username={username} channel={channel} />
              </div>
            </>
          )}
        </section>
      )}
    </main>
  )
}
