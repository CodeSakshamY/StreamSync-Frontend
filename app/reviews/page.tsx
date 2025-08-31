import Navbar from "@/components/navbar"
import PostBoard from "@/components/post-board"

export default function Page() {
  return (
    <main>
      <Navbar />
      <PostBoard kind="review" />
    </main>
  )
}
