import { useState, useRef, useEffect } from "react";
import * as tus from "tus-js-client";
import { supabase } from "../config/supabase";
import axios from "../api/axios";

/*
  Production FileUpload
  - 5GB+ support
  - Resumable
  - Crash-safe
  - Resume after refresh
  - Network recovery
*/

const MAX_FILE_SIZE = 10 * 1024 * 1024 * 1024; // 10GB
const CHUNK_SIZE = 6 * 1024 * 1024; // 6MB

export default function FileUpload({ onSuccess }) {
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");

  const uploadRef = useRef(null);

  /* ===========================
     ENV VALIDATION
  =========================== */
  useEffect(() => {
    if (!import.meta.env.VITE_SUPABASE_URL) {
      console.error("❌ Missing SUPABASE URL");
    }

    if (!import.meta.env.VITE_SUPABASE_KEY) {
      console.error("❌ Missing SUPABASE KEY");
    }
  }, []);

  /* ===========================
     CLEAN OLD UPLOADS
  =========================== */
  useEffect(() => {
    return () => {
      if (uploadRef.current) {
        uploadRef.current.abort();
      }
    };
  }, []);

  /* ===========================
     FILE UPLOAD
  =========================== */
  const uploadFile = (file) => {
    if (!file) return;

    /* Size validation */
    if (file.size > MAX_FILE_SIZE) {
      setError("File too large. Max 10GB allowed.");
      return;
    }

    if (!import.meta.env.VITE_SUPABASE_URL ||
        !import.meta.env.VITE_SUPABASE_KEY) {
      setError("Storage configuration missing");
      return;
    }

    setFileName(file.name);
    setUploading(true);
    setProgress(0);
    setError("");

    /* Unique storage path */
    const filePath = `${Date.now()}_${crypto.randomUUID()}_${file.name}`;

    /* TUS UPLOAD */
    const upload = new tus.Upload(file, {
      endpoint: `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/upload/resumable`,

      headers: {
        authorization: `Bearer ${import.meta.env.VITE_SUPABASE_KEY}`,
        "x-upsert": "true",
      },

      metadata: {
        bucketName: "uploads",
        objectName: filePath,
        contentType: file.type || "application/octet-stream",
        cacheControl: "3600",
      },

      chunkSize: CHUNK_SIZE,

      retryDelays: [0, 3000, 5000, 10000, 20000],

      removeFingerprintOnSuccess: true,

      /* Resume support */
      fingerprint: (file) => {
        return [
          file.name,
          file.type,
          file.size,
          file.lastModified,
        ].join("-");
      },

      onProgress: (bytesUploaded, bytesTotal) => {
        const percentage = Math.floor(
          (bytesUploaded / bytesTotal) * 100
        );

        setProgress(percentage);
      },

      /* SUCCESS */
      onSuccess: async () => {
        try {
          setUploading(false);

          /* Public URL */
          const { data, error: urlError } = supabase
            .storage
            .from("uploads")
            .getPublicUrl(filePath);

          if (urlError) {
            throw urlError;
          }

          const fileUrl = data.publicUrl;

          /* Save metadata */
          await axios.post("/files/create", {
            name: file.name,
            url: fileUrl,
            size: file.size,
            path: filePath,
          });

          console.log("✅ Upload complete:", fileUrl);

          if (onSuccess) {
            onSuccess({
              name: file.name,
              url: fileUrl,
              size: file.size,
              path: filePath,
            });
          }

        } catch (err) {
          console.error("Post-upload error:", err);
          setError("Upload completed but final step failed.");
        }
      },

      /* ERROR */
      onError: (err) => {
        console.error("❌ Upload error:", err);

        setUploading(false);

        if (err?.originalRequest?._xhr?.status === 401) {
          setError("Storage authorization failed.");
        } else {
          setError("Upload failed. Check your connection.");
        }
      },
    });

    /* Resume old upload if exists */
    upload.findPreviousUploads().then((previousUploads) => {
      if (previousUploads.length) {
        upload.resumeFromPreviousUpload(previousUploads[0]);
      }

      upload.start();
    });

    uploadRef.current = upload;
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
