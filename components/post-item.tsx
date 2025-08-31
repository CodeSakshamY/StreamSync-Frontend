"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import VoteButtons from "./vote-buttons"
import type { Post } from "./post-composer"

export default function PostItem({ post, onVote }: { post: Post; onVote: (delta: number) => void }) {
  return (
    <Card>
      <CardHeader className="py-3">
        <CardTitle className="text-pretty text-base">{post.title}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        {post.kind === "meme" && post.imageUrl ? (
          <div className="overflow-hidden rounded border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.imageUrl || "/placeholder.svg"} alt={post.title} className="h-auto w-full object-cover" />
          </div>
        ) : null}
        {post.kind === "meme" && !post.imageUrl ? (
          <div className="overflow-hidden rounded border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/funny-meme-placeholder.png" alt="Meme placeholder" className="h-auto w-full object-cover" />
          </div>
        ) : null}
        {post.kind === "review" && post.body ? <p className="text-sm leading-relaxed">{post.body}</p> : null}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{new Date(post.ts).toLocaleString()}</span>
          <VoteButtons votes={post.votes} onUp={() => onVote(1)} onDown={() => onVote(-1)} />
        </div>
      </CardContent>
    </Card>
  )
}
import { useState } from "react";
import { uploadImage } from "@/lib/uploadImage";

export default function CreatePost() {
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  const handleUpload = async () => {
    if (!file) return alert("Please choose a file");
    const url = await uploadImage(file);
    if (url) {
      setImageUrl(url);
      alert("Image uploaded successfully!");
    }
  };

  return (
    <div>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Upload Meme</button>

      {imageUrl && (
        <div>
          <p>Uploaded Image:</p>
          <img src={imageUrl} alt="Meme" width={200} />
        </div>
      )}
    </div>
  );
}
