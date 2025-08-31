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
"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { uploadImage } from "@/lib/uploadImage";

export default function ChatPanel() {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [posts, setPosts] = useState<any[]>([]);

  // Fetch existing posts
  const fetchPosts = async () => {
    const { data, error } = await supabase.from("posts").select("*").order("id", { ascending: false });
    if (!error && data) setPosts(data);
  };

  // Upload new meme
  const handleUpload = async () => {
    if (!file) return alert("Please choose a file");

    const url = await uploadImage(file, "memes");
    if (!url) return alert("Upload failed!");

    setImageUrl(url);

    const { error } = await supabase.from("posts").insert([{ title, image_url: url }]);
    if (error) console.error("DB Insert Error:", error);
    else setTitle(""); // Clear title field
  };

  // Realtime subscription
  useEffect(() => {
    fetchPosts();

    const channel = supabase
      .channel("realtime-posts")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "posts" },
        (payload) => {
          setPosts((prev) => [payload.new, ...prev]); // Add new post on top
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="p-4">
      <input
        type="text"
        placeholder="Enter meme title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border p-2 mb-2 w-full"
      />

      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="mb-2"
      />

      <button onClick={handleUpload} className="bg-blue-500 text-white p-2">
        Upload Meme
      </button>

      <div className="mt-4">
        {posts.map((post) => (
          <div key={post.id} className="border p-2 mb-2">
            <h3 className="font-bold">{post.title}</h3>
            <img src={post.image_url} alt="Meme" width={200} />
          </div>
        ))}
      </div>
    </div>
  );
}
