"use client"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export type Post = {
  id: string
  kind: "meme" | "review"
  title: string
  body?: string
  imageUrl?: string
  votes: number
  author: string
  ts: number
}

export default function PostComposer({ kind, onAdd }: { kind: "meme" | "review"; onAdd: (p: Post) => void }) {
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [imageUrl, setImageUrl] = useState("")

  function submit() {
    if (!title.trim()) return
    const post: Post = {
      id: crypto.randomUUID(),
      kind,
      title: title.trim(),
      body: kind === "review" ? body.trim() : undefined,
      imageUrl: kind === "meme" ? imageUrl.trim() || undefined : undefined,
      votes: 0,
      author: "anon",
      ts: Date.now(),
    }
    onAdd(post)
    setTitle("")
    setBody("")
    setImageUrl("")
  }

  return (
    <Card>
      <CardContent className="grid gap-3 p-4">
        <Input
          placeholder={kind === "meme" ? "Meme title" : "Review title"}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        {kind === "meme" ? (
          <Input placeholder="Image URL (optional)" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
        ) : (
          <Textarea placeholder="Write your review..." value={body} onChange={(e) => setBody(e.target.value)} />
        )}
        <div className="flex justify-end">
          <Button onClick={submit}>Post</Button>
        </div>
      </CardContent>
    </Card>
  )
}
