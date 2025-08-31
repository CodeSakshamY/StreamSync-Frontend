"use client"
import { Button } from "@/components/ui/button"

export default function VoteButtons({ votes, onUp, onDown }: { votes: number; onUp: () => void; onDown: () => void }) {
  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={onUp} aria-label="Upvote">
        ▲
      </Button>
      <span className="w-8 text-center text-sm">{votes}</span>
      <Button variant="outline" size="sm" onClick={onDown} aria-label="Downvote">
        ▼
      </Button>
    </div>
  )
}
