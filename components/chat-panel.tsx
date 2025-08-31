"use client";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function ChatPanel() {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Fetch existing messages
  useEffect(() => {
    fetchMessages();

    // Real-time updates
    const channel = supabase
      .channel("chat-room")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchMessages = async () => {
    const { data } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: true });
    setMessages(data || []);
  };

  const handleSendMessage = async () => {
    if (!newMessage && !imageFile) return;

    let imageUrl = null;
    if (imageFile) {
      const { data, error } = await supabase.storage
        .from("memes")
        .upload(`chat/${Date.now()}-${imageFile.name}`, imageFile);
      if (!error) {
        const { data: publicUrl } = supabase.storage
          .from("memes")
          .getPublicUrl(data.path);
        imageUrl = publicUrl.publicUrl;
      }
    }

    await supabase.from("messages").insert({
      content: newMessage,
      image_url: imageUrl,
      user_id: "demo-user", // Replace with auth user ID if using auth
    });

    setNewMessage("");
    setImageFile(null);
  };

  return (
    <div>
      <div className="chat-window">
        {messages.map((msg) => (
          <div key={msg.id} className="message">
            {msg.content && <p>{msg.content}</p>}
            {msg.image_url && (
              <img src={msg.image_url} alt="uploaded" width={200} />
            )}
          </div>
        ))}
      </div>

      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type a message"
      />
      <input type="file" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
}
