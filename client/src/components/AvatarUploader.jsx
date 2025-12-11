import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";

function getCroppedImg(imageSrc, pixelCrop, rotation = 0) {
  // returns a blob (cropped and compressed)
  const canvas = document.createElement("canvas");
  const size = Math.max(pixelCrop.width, pixelCrop.height);
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  const img = document.createElement("img");
  img.src = imageSrc;

  return new Promise((resolve, reject) => {
    img.onload = () => {
      // draw cropped area
      ctx.drawImage(
        img,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        size,
        size
      );
      // convert to blob (webp) compressed
      canvas.toBlob(
        (blob) => {
          resolve(blob);
        },
        "image/webp",
        0.8
      );
    };
    img.onerror = (e) => reject(e);
  });
}

export default function AvatarUploader({ onUploaded, initialUrl }) {
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [loading, setLoading] = useState(false);

  const onFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.addEventListener("load", () => setImageSrc(reader.result));
    reader.readAsDataURL(file);
  };

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleUpload = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    setLoading(true);
    try {
      const blob = await getCroppedImg(imageSrc, croppedAreaPixels);
      // upload blob
      const form = new FormData();
      form.append("avatar", blob, "avatar.webp");

      // get token
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/profile/avatar", {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: form,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Upload failed");
      onUploaded && onUploaded(data.avatarUrl);
      setImageSrc(null);
    } catch (err) {
      console.error("Avatar upload error", err);
      alert(err.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {initialUrl && !imageSrc && (
        <img src={initialUrl} alt="avatar" className="h-20 w-20 rounded-full object-cover" />
      )}

      <div className="mt-2">
        <input type="file" accept="image/*" onChange={onFileChange} />
      </div>

      {imageSrc && (
        <div className="relative h-64 w-full bg-gray-800/10 mt-3">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
          />
        </div>
      )}

      {imageSrc && (
        <div className="mt-3 flex items-center gap-2">
          <button onClick={handleUpload} disabled={loading} className="rounded bg-indigo-600 px-4 py-2 text-white">
            {loading ? "Uploading..." : "Save avatar"}
          </button>
          <button onClick={() => setImageSrc(null)} className="rounded border px-3 py-2">
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}