/**
 * ImgBB Image Upload Utility (Challenge 3)
 * Supports direct file upload to ImgBB API with automatic graceful base64 fallback
 * so image uploads NEVER fail even if an API key is missing or invalid.
 */
export async function uploadToImgBB(file: File): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY?.trim();

  if (apiKey && apiKey !== "YOUR_IMGBB_KEY") {
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.success && data.data?.display_url) {
        return data.data.display_url;
      }
      if (data.success && data.data?.url) {
        return data.data.url;
      }
      console.warn("ImgBB returned error, using reliable local Data URL fallback:", data.error?.message);
    } catch (err) {
      console.warn("ImgBB upload failed, falling back to Data URL:", err);
    }
  }

  // Graceful fallback to Data URL (base64) so user upload is 100% successful
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Failed to process image file"));
    reader.readAsDataURL(file);
  });
}
