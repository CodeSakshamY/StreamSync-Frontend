"use client"
import { useCallback, useEffect, useRef, useState } from "react"
import dynamic from "next/dynamic"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { SyncChannel } from "@/lib/ws-client"

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false })
import videojs from "video.js"
import "video.js/dist/video-js.css"

type Props = {
  roomId: string
  username: string
  channel: SyncChannel
  onBindChannel: (handler: (msg: any) => void) => void
}

export default function PlayerSync({ roomId, username, channel, onBindChannel }: Props) {
  const [tab, setTab] = useState<"youtube" | "upload">("youtube")
  const [ytUrl, setYtUrl] = useState("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)

  const rpRef = useRef<any>(null)

  const vRef = useRef<HTMLVideoElement | null>(null)
  const vPlayer = useRef<videojs.Player | null>(null)
  const [fileUrl, setFileUrl] = useState<string | null>(null)

  const handleMessage = useCallback(
    (msg: any) => {
      if (msg.type === "chat") return
      if (tab === "youtube") {
        if (!rpRef.current) return
        if (msg.type === "play") {
          rpRef.current.seekTo(msg.at, "seconds")
          setPlaying(true)
        } else if (msg.type === "pause") {
          rpRef.current.seekTo(msg.at, "seconds")
          setPlaying(false)
        } else if (msg.type === "seek") {
          rpRef.current.seekTo(msg.to, "seconds")
        } else if (msg.type === "state") {
          setPlaying(msg.playing)
          rpRef.current.seekTo(msg.at, "seconds")
        }
      } else {
        const p = vPlayer.current
        if (!p) return
        if (msg.type === "play") {
          p.currentTime(msg.at)
          p.play()
        } else if (msg.type === "pause") {
          p.currentTime(msg.at)
          p.pause()
        } else if (msg.type === "seek") {
          p.currentTime(msg.to)
        } else if (msg.type === "state") {
          p.currentTime(msg.at)
          msg.playing ? p.play() : p.pause()
        }
      }
    },
    [tab],
  )

  useEffect(() => {
    onBindChannel(handleMessage)
  }, [handleMessage, onBindChannel])

  // Setup video.js when file selected
  useEffect(() => {
    if (!vRef.current) return
    if (vPlayer.current) {
      vPlayer.current.dispose()
      vPlayer.current = null
    }
    vPlayer.current = videojs(vRef.current, {
      controls: true,
      preload: "auto",
      sources: fileUrl ? [{ src: fileUrl, type: "video/mp4" }] : [],
    })
    const p = vPlayer.current
    const onPlay = () => channel.send({ type: "play", at: p.currentTime() })
    const onPause = () => channel.send({ type: "pause", at: p.currentTime() })
    const onSeeked = () => channel.send({ type: "seek", to: p.currentTime() })
    p.on("play", onPlay)
    p.on("pause", onPause)
    p.on("seeked", onSeeked)
    return () => {
      p.off("play", onPlay)
      p.off("pause", onPause)
      p.off("seeked", onSeeked)
      p.dispose()
    }
  }, [fileUrl, channel])

  const onRPProgress = useCallback((state: any) => {
    setCurrentTime(state.playedSeconds ?? 0)
  }, [])

  const broadcastState = useCallback(() => {
    channel.send({ type: "state", playing, at: currentTime })
  }, [channel, playing, currentTime])

  return (
    <Card>
      <CardContent className="grid gap-4 p-4">
        <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="youtube">YouTube</TabsTrigger>
            <TabsTrigger value="upload">Upload</TabsTrigger>
          </TabsList>

          <TabsContent value="youtube" className="grid gap-3">
            <div className="grid gap-2">
              <Label htmlFor="yt">YouTube URL</Label>
              <Input
                id="yt"
                value={ytUrl}
                onChange={(e) => setYtUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
              />
            </div>
            <div className="aspect-video overflow-hidden rounded border">
              <ReactPlayer
                ref={rpRef}
                url={ytUrl}
                width="100%"
                height="100%"
                controls
                playing={playing}
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                onSeek={(to: number) => channel.send({ type: "seek", to })}
                onProgress={onRPProgress}
                onPlayCapture={() => channel.send({ type: "play", at: currentTime })}
                onPauseCapture={() => channel.send({ type: "pause", at: currentTime })}
              />
            </div>
          </TabsContent>

          <TabsContent value="upload" className="grid gap-3">
            <div className="grid gap-2">
              <Label htmlFor="file">Choose MP4 file</Label>
              <Input
                id="file"
                type="file"
                accept="video/mp4"
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (!f) return
                  const url = URL.createObjectURL(f)
                  setFileUrl(url)
                }}
              />
            </div>
            <div className="aspect-video overflow-hidden rounded border">
              <video ref={vRef} className="video-js vjs-default-skin w-full h-full" playsInline />
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Room: <span className="font-medium">{roomId}</span> • User: <span className="font-medium">{username}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={broadcastState}>
              Sync All
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
