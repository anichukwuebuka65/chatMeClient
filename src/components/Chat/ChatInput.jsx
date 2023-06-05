import React from "react";

export default function ChatInput({
  handleFile,
  message,
  setMessage,
  addMessage,
}) {
  return (
    <div className="absolute flex gap-4 sm:gap-2 left-0 right-0  p-2 bottom-0 bg-[#e7dddd] shadow-sm">
      <label
        className="flex items-center cursor-pointer opacity-80"
        htmlFor="file"
      >
        <img src="/assets/add.png" />
      </label>
      <input
        onChange={handleFile}
        className="hidden"
        type="file"
        id="file"
      ></input>
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="block shrink rounded-full w-full h-10 px-4 outline-0"
        type="text"
        placeholder="Message..."
      />
      <button
        onClick={addMessage}
        className=" rounded-md px-4 text-white bg-[#8173c2]"
        type="button"
      >
        {" "}
        send{" "}
      </button>
    </div>
  );
}
