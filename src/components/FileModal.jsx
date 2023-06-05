import React from "react";

export default function FileModal({
  file,
  handleFileUpload,
  setImageModalOpen,
}) {
  const src = URL.createObjectURL(file);

  function isFileSupported() {
    return (
      file.type.includes("image") ||
      file.type.includes("audio") ||
      file.type.includes("video")
    );
  }

  return (
    <div className="absolute z-50 bg-[rgba(0,0,0,0.8)] inset-0">
      <div
        style={{ width: "calc(100% - 20px)" }}
        className="absolute top-1/2 -translate-y-1/2 bg-[#f7f1f1] grid gap-4 p-2 rounde-md"
      >
        {file.type.includes("image") ? (
          <img className="w-full" src={src} />
        ) : file.type.includes("audio") ? (
          <audio className="w-full" src={src} controls />
        ) : file.type.includes("video") ? (
          <video className="w-full" src={src} controls />
        ) : (
          <p>file not supported</p>
        )}

        <div className="flex justify-between">
          <button
            disabled={!isFileSupported()}
            onClick={handleFileUpload}
            className={`${
              !isFileSupported() && "cursor-not-allowed"
            } px-6 py-2 bg-[#8173c2] text-white rounded-sm`}
          >
            send
          </button>
          <button
            onClick={() => setImageModalOpen(false)}
            className="px-6 py-2 bg-[#913d17] text-white rounded-sm"
          >
            cancel
          </button>
        </div>
      </div>
    </div>
  );
}
