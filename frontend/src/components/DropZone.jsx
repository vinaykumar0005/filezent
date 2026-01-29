import { useRef } from "react";

export default function DropZone({ onFile }) {
  const inputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) onFile(file);
  };

  const handleClick = () => {
    inputRef.current.click();
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) onFile(file);
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      onClick={handleClick}
      className="
  border-2 border-dashed border-gray-500
  rounded-xl p-12 cursor-pointer
  hover:border-white transition
  bg-black/30
"
    >
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={handleFileSelect}
      />

      <p className="text-gray-600 text-sm">
        <strong>Drag & drop</strong> your file here
      </p>
      <p className="text-gray-500 text-xs mt-1">
        or <span className="underline">click to upload</span>
      </p>
    </div>
  );
}
