/**
 * ImgBB Image Upload Utility (Challenge 3)
 * Supports direct file upload to ImgBB API using multipart/form-data.
 */
export async function uploadToImgBB(file: File): Promise<string> {
  const apiKey =
    process.env.NEXT_PUBLIC_IMGBB_API_KEY || "8c8430b200b39ad34b223d6a62a74c77";

  const formData = new FormData();
  formData.append("image", file);

  try {
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (data.success && data.data?.display_url) {
      return data.data.display_url;
    }
    if (data.data?.url) {
      return data.data.url;
    }
    throw new Error(data.error?.message || "Image upload failed");
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Image upload failed";
    console.error("ImgBB upload error:", message);
    throw new Error(message);
  }
}
