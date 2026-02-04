import { useState, useRef } from "react";
import DropZone from "../components/DropZone";
import api from "../api/axios";

const CHUNK_SIZE = 5 * 1024 * 1024;
const MAX_RETRIES = 3;
const REQUEST_TIMEOUT = 60_000; // 60s per chunk

export default function Upload() {
  const [progress, setProgress] = useState(0);
  const [downloadLink, setDownloadLink] = useState("");
  const [receiverEmail, setReceiverEmail] = useState("");
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [copied, setCopied] = useState(false);
  const [sending, setSending] = useState(false);

  const abortRef = useRef(null);

  /* ========================
     FILE UPLOAD
  ======================== */
  const uploadFile = async (file) => {
    if (!file) return;

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      setFileName(file.name);
      setUploading(true);
      setProgress(0);
      setDownloadLink("");

      const uploadId = crypto.randomUUID();
      const totalChunks = Math.ceil(file.size / CHUNK_SIZE);

      for (let i = 0; i < totalChunks; i++) {
        let success = false;
        let attempts = 0;

        const chunk = file.slice(
          i * CHUNK_SIZE,
          (i + 1) * CHUNK_SIZE
        );

        while (!success && attempts < MAX_RETRIES) {
          try {
            const form = new FormData();

            form.append("file", chunk);
            form.append("uploadId", uploadId);
            form.append("chunkIndex", i);
            form.append("totalChunks", totalChunks);
            form.append("fileName", file.name);

            const res = await api.post(
              "/files/upload",
              form,
              {
                timeout: 0, // 🔥 IMPORTANT (disable timeout)

                onUploadProgress: (e) => {
                  if (e.total) {
                    const percent = Math.round(
                      ((i + e.loaded / e.total) / totalChunks) * 100
                    );
                    setProgress(percent);
                  }
                },
              }
            );


            if (!res?.data) {
              throw new Error("Invalid server response");
            }

            // Progress update
            const percent = Math.round(
              ((i + 1) / totalChunks) * 100
            );

            setProgress(percent);

            // Final chunk gives link
            if (res.data?.downloadLink) {
              setDownloadLink(res.data.downloadLink);
            }

            success = true;

          } catch (err) {
            attempts++;

            console.error(
              `Chunk ${i} failed (try ${attempts}):`,
              err?.message
            );

            if (attempts >= MAX_RETRIES) {
              throw new Error(
                `Chunk ${i} failed after ${MAX_RETRIES} retries`
              );
            }

            // small delay before retry
            await new Promise((r) => setTimeout(r, 1500));
          }
        }
      }

    } catch (err) {
      console.error("Upload Error:", err);

      if (err.name === "CanceledError") {
        alert("Upload cancelled");
      } else {
        alert(err.message || "Upload failed. Try again.");
      }

    } finally {
      setUploading(false);
      abortRef.current = null;
    }
  };

  /* ========================
     SEND EMAIL
  ======================== */
  const sendEmail = async () => {
    if (!receiverEmail) {
      alert("Enter receiver email");
      return;
    }

    try {
      setSending(true);

      await api.post("/files/email", {
        email: receiverEmail,
        link: downloadLink,
      });

      alert("Email sent successfully!");
      setReceiverEmail("");

    } catch (err) {
      console.error("Email Error:", err);
      alert("Email sending failed");

    } finally {
      setSending(false);
    }
  };

  /* ========================
     COPY LINK
  ======================== */
  const copyLink = () => {
    navigator.clipboard.writeText(downloadLink);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4">

      <div className="max-w-4xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-12">

          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg mb-4">
            📤
          </div>

          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Filezent Upload
          </h1>

          <p className="text-gray-600 text-lg">
            Upload & share files securely
          </p>
        </div>

        {/* UPLOAD CARD */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/30 mb-10">

          <DropZone onFile={uploadFile} />

          {/* PROGRESS */}
          {uploading && (
            <div className="mt-8">

              <div className="flex justify-between items-center mb-3">

                <div>
                  <p className="font-medium text-gray-800">
                    {fileName}
                  </p>

                  <p className="text-sm text-gray-500">
                    Uploading...
                  </p>
                </div>

                <span className="text-xl font-bold text-blue-600">
                  {progress}%
                </span>

              </div>

              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">

                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-300"
                  style={{
                    width: `${progress}%`,
                  }}
                />

              </div>

            </div>
          )}

          {/* SUCCESS */}
          {downloadLink && !uploading && (
            <div className="mt-8 space-y-6">

              <div className="bg-green-50 border border-green-200 rounded-2xl p-5 flex items-center gap-4">

                <div className="text-3xl">✅</div>

                <div>
                  <h3 className="font-semibold text-green-800">
                    Upload Successful
                  </h3>

                  <p className="text-sm text-green-600">
                    File ready to share
                  </p>
                </div>

              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">

                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Download Link
                </label>

                <div className="flex gap-2">

                  <input
                    type="text"
                    value={downloadLink}
                    readOnly
                    className="flex-1 px-4 py-2 bg-white border rounded-xl text-black text-sm"
                  />

                  <button
                    onClick={copyLink}
                    className="px-5 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition"
                  >
                    {copied ? "Copied" : "Copy"}
                  </button>

                </div>

              </div>

              <div className="bg-white border rounded-2xl p-5">

                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Send via Email
                </label>

                <div className="flex gap-2">

                  <input
                    type="email"
                    placeholder="receiver@example.com"
                    value={receiverEmail}
                    onChange={(e) =>
                      setReceiverEmail(e.target.value)
                    }
                    className="flex-1 px-4 py-2 border rounded-xl text-black focus:ring-2 focus:ring-blue-200 outline-none"
                  />

                  <button
                    onClick={sendEmail}
                    disabled={sending}
                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition disabled:opacity-60"
                  >
                    {sending ? "Sending..." : "Send"}
                  </button>

                </div>

              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
