import Navbar from "@/components/navbar"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Page() {
  return (
    <main>
      <Navbar />
      <section className="mx-auto grid max-w-5xl items-center gap-8 px-4 py-12 md:grid-cols-2">
        <div className="space-y-4">
          <h1 className="text-balance text-3xl font-semibold md:text-4xl">
            Watch together. Chat live. Share memes and reviews.
          </h1>
          <p className="text-pretty text-muted-foreground">
            Create watch parties with synced playback for YouTube or your own videos. Hang out with friends using live
            chat, and share memes or reviews with upvotes.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/signup">
              <Button>Get Started</Button>
            </Link>
            <Link href="/watch-party">
              <Button variant="outline">Start a Watch Party</Button>
            </Link>
            <Button variant="outline" title="Coming soon">
              Connect to OTT
            </Button>
          </div>
        </div>
        <div className="rounded border bg-muted/40 p-2">
          {/* preview image placeholder */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/watch-party-preview.png" alt="Watch party preview" className="w-full rounded" />
        </div>
      </section>
    </main>
  )
}
