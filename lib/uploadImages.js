import { supabase } from "./supabaseClient";

export async function uploadImage(file, folder = "memes") {
  if (!file) return null;

  const fileName = `${folder}/${Date.now()}-${file.name}`;
  
  // 1️⃣ Upload file to Supabase Storage
  const { data, error } = await supabase.storage
    .from("memes") // bucket name
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false
    });

  if (error) {
    console.error("Upload error:", error);
    return null;
  }

  // 2️⃣ Get public URL
  const { data: publicData } = supabase.storage
    .from("memes")
    .getPublicUrl(fileName);

  return publicData.publicUrl;
}
