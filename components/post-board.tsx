"use client"
import useSWR from "swr"
import { lsGet, lsSet } from "@/lib/local-store"
import PostComposer, { type Post } from "./post-composer"
import PostItem from "./post-item"

const KEY = "wp_posts_v1"

function fetchPosts(): Post[] {
  return lsGet<Post[]>(KEY, [])
}

function savePosts(posts: Post[]) {
  lsSet<Post[]>(KEY, posts)
}

export default function PostBoard({ kind }: { kind: "meme" | "review" }) {
  const { data: posts, mutate } = useSWR<Post[]>(KEY, fetchPosts, { fallbackData: [] })

  function add(p: Post) {
    const next = [p, ...(posts ?? [])]
    savePosts(next)
    mutate(next, false)
  }

  function onVote(id: string, delta: number) {
    const next = (posts ?? []).map((p) => (p.id === id ? { ...p, votes: p.votes + delta } : p))
    savePosts(next)
    mutate(next, false)
  }

  const filtered = (posts ?? []).filter((p) => p.kind === kind)

  return (
    <div className="mx-auto grid max-w-3xl gap-4 px-4 py-6">
      <PostComposer kind={kind} onAdd={add} />
      <div className="grid gap-4">
        {filtered.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">
            No {kind === "meme" ? "memes" : "reviews"} yet. Be the first to post!
          </p>
        ) : (
          filtered.map((p) => <PostItem key={p.id} post={p} onVote={(d) => onVote(p.id, d)} />)
        )}
      </div>
    </div>
  )
}
