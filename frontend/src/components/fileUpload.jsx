import { useState } from "react";
import * as tus from "tus-js-client";
import { supabase } from "../config/supabase";
import axios from "../api/axios";

/*
  FileUpload Component
  - Supports 5GB+ files
  - Resumable upload
  - Progress bar
  - Supabase storage
*/

export default function FileUpload({ onSuccess }) {
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");

  const uploadFile = (file) => {
    if (!file) return;

    // Optional: Limit size (example: 10GB)
    if (file.size > 10 * 1024 * 1024 * 1024) {
      setError("File too large. Max 10GB allowed.");
      return;
    }

    setFileName(file.name);
    setUploading(true);
    setProgress(0);
    setError("");

    // Generate unique name in storage
    const filePath = `${Date.now()}_${file.name}`;

    const upload = new tus.Upload(file, {
      endpoint: `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/upload/resumable`,

      headers: {
        authorization: `Bearer ${import.meta.env.VITE_SUPABASE_KEY}`,
        "x-upsert": "true",
      },

      metadata: {
        bucketName: "uploads",
        objectName: filePath,
        contentType: file.type,
        cacheControl: "3600",
      },

      chunkSize: 6 * 1024 * 1024, // 6MB chunks

      retryDelays: [0, 3000, 5000, 10000],

      onProgress: (bytesUploaded, bytesTotal) => {
        const percentage = Math.floor(
          (bytesUploaded / bytesTotal) * 100
        );

        setProgress(percentage);
      },

      onSuccess: async () => {
        setUploading(false);

        // Get public URL
        const { data } = supabase
          .storage
          .from("uploads")
          .getPublicUrl(filePath);

        const fileUrl = data.publicUrl;
        // 3️⃣ 👉 PUT YOUR CODE HERE (Save in DB)
        await axios.post("/files/create", {
          name: file.name,
          url: fileUrl,
          size: file.size,
        });

        console.log("Upload complete:", fileUrl);

        // Send back to parent (optional)
        if (onSuccess) {
          onSuccess({
            name: file.name,
            url: fileUrl,
            size: file.size,
            path: filePath,
          });
        }
      },

      onError: (err) => {
        console.error("Upload error:", err);

        setUploading(false);
        setError("Upload failed. Try again.");
      },
    });

    upload.start();
  };

  return (
    <div className="w-full max-w-md mx-auto">

      {/* File Input */}
      <label className="block w-full cursor-pointer">
        <input
          type="file"
          className="hidden"
          onChange={(e) => uploadFile(e.target.files[0])}
        />

        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-500 transition">

          <p className="font-semibold text-gray-700">
            Click to select file
          </p>

          <p className="text-sm text-gray-500 mt-1">
            Supports large files (5GB+)
          </p>
        </div>
      </label>

      {/* File Info */}
      {fileName && (
        <p className="mt-3 text-sm text-gray-600 truncate">
          {fileName}
        </p>
      )}

      {/* Progress Bar */}
      {uploading && (
        <div className="mt-4">

          <div className="flex justify-between mb-1 text-sm">
            <span>Uploading</span>
            <span>{progress}%</span>
          </div>

          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">

            <div
              className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all"
              style={{ width: `${progress}%` }}
            ></div>

          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="mt-3 text-sm text-red-600 text-center">
          {error}
        </p>
      )}

    </div>
  );
}

//code before superbase setup
// import axios from "../api/axios";

// const CHUNK_SIZE = 5 * 1024 * 1024;

// export default function FileUpload() {
//   const uploadFile = async (file) => {
//     const uploadId = crypto.randomUUID();
//     const totalChunks = Math.ceil(file.size / CHUNK_SIZE);

//     for (let i = 0; i < totalChunks; i++) {
//       const chunk = file.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);

//       const form = new FormData();
//       form.append("file", chunk);
//       form.append("uploadId", uploadId);
//       form.append("chunkIndex", i);
//       form.append("totalChunks", totalChunks);
//       form.append("fileName", file.name);

//       await axios.post("/files/upload", form);
//     }
//   };

//   return (
//     <input
//       type="file"
//       onChange={(e) => uploadFile(e.target.files[0])}
//     />
//   );
// }
