// components/AddUrlModal.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface AddUrlModalProps {
  onClose: () => void;
  onCreated: () => void;
}

export default function AddUrlModal({ onClose, onCreated }: AddUrlModalProps) {
  const [id, setId] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [urlMobile, setUrlMobile] = useState("");
  const [urlDesktop, setUrlDesktop] = useState("");
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setMounted(true);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!id.trim() || !urlMobile.trim()) {
      setError("Custom ID and Mobile URL are required.");
      return;
    }
    if (!imageFile) {
      setError("Please choose an image (GIF/PNG/JPG).");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("id", id.trim());
      formData.append("image", imageFile);
      formData.append("urlMobile", urlMobile.trim());
      formData.append("urlDesktop", urlDesktop.trim());

      const res = await fetch("/api/create", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        await res.json();
        onCreated();

        // Clear form
        setId("");
        setImageFile(null);
        setUrlMobile("");
        setUrlDesktop("");
        if (fileInputRef.current) fileInputRef.current.value = "";

        onClose();
      } else {
        const errorData = await res.json().catch(() => ({}));
        setError(errorData.error || "Failed to create link");
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred.");
    }
  }

  const modal = (
    <div
      className="fixed inset-0 z-[9999] bg-black/70"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="flex lg:h-screen w-screen items-center justify-center p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-slate-800 rounded-lg shadow-2xl w-full max-w-md animate-fade-in mt-20 lg:mt-0 border border-slate-700">
          <div className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 px-6 py-4 flex justify-between items-center rounded-t-lg">
            <h2 className="text-lg font-semibold text-white">Add Link</h2>
            <button
              onClick={onClose}
              className="text-white/90 hover:text-white transition"
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>
          <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
            <div>
              <label
                htmlFor="id"
                className="block text-sm font-medium text-slate-300 mb-1"
              >
                Image Name
              </label>
              <input
                type="text"
                id="id"
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder="Enter custom ID"
                className="block w-full border border-slate-600 rounded-md px-3 py-2 bg-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Upload Image
              </label>
              <input
                type="file"
                accept="image/gif,image/png,image/jpeg"
                onChange={(e) => {
                  const files = e.target.files;
                  if (files && files[0]) setImageFile(files[0]);
                }}
                ref={fileInputRef}
                className="block w-full border border-slate-600 rounded-md px-3 py-2 bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label
                htmlFor="urlMobile"
                className="block text-sm font-medium text-slate-300 mb-1"
              >
                Facebook URL
              </label>
              <input
                type="url"
                id="urlMobile"
                value={urlMobile}
                onChange={(e) => setUrlMobile(e.target.value)}
                placeholder="https://example.com/mobile"
                className="block w-full border border-slate-600 rounded-md px-3 py-2 bg-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label
                htmlFor="urlDesktop"
                className="block text-sm font-medium text-slate-300 mb-1"
              >
                Other URL (optional)
              </label>
              <input
                type="url"
                id="urlDesktop"
                value={urlDesktop}
                onChange={(e) => setUrlDesktop(e.target.value)}
                placeholder="https://example.com/desktop"
                className="block w-full border border-slate-600 rounded-md px-3 py-2 bg-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            {error && <div className="text-red-400 text-sm">{error}</div>}

            <div className="flex items-center justify-between pt-2">
              <button
                type="submit"
                className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:opacity-90 text-white px-4 py-2 rounded-md shadow transition-opacity duration-200"
              >
                Submit
              </button>
              <button
                type="button"
                onClick={onClose}
                className="bg-slate-700 hover:bg-slate-600 text-slate-300 px-4 py-2 rounded-md"
              >
                Close
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  // Render via portal so the overlay isn't constrained by any transformed ancestor
  if (!mounted) return null;
  return createPortal(modal, document.body);
}
