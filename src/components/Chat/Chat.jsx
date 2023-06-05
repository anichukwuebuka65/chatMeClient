import React, { useEffect, useRef, useState } from "react";
import Video from "../Video/Video";
import FileModal from "../FileModal";
import Messages from "./Messages";
import ChatInput from "./ChatInput";

export default function Chat({
  setShowMessages,
  setMessages,
  showMessages,
  messages,
  stream,
  dataChannel,
  channelOpened,
}) {
  const [message, setMessage] = useState("");
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const scrollToViewRef = useRef();
  const [file, setFile] = useState();

  function handleFile(e) {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      setImageModalOpen(true);
    }
  }
  function handleFileUpload() {
    setImageModalOpen(false);

    const supportedFormats = ["audio", "video", "image"];
    if (
      !supportedFormats.some((format) => {
        return file.type.includes(format);
      })
    ) {
      return upDateMessages("local", "error", "unsupported format");
    }

    const src = URL.createObjectURL(file);
    upDateMessages("local", file.type, src);

    sendFile();
  }

  function sendFile() {
    if (dataChannel) {
      dataChannel.send(
        JSON.stringify({ type: file.type, name: file.name, size: file.size })
      );
    }
    let bytePerChuck = 1200;
    let currentChunk = 0;
    let start = 0;
    const size = file.size;
    let end = Math.min(size, start + bytePerChuck);

    while (bytePerChuck * currentChunk < size) {
      const reader = new FileReader();
      reader.onload = () => {
        dataChannel.send(reader.result);
      };
      const blob = file.slice(start, end);
      reader.readAsArrayBuffer(blob);
      currentChunk++;
      start = bytePerChuck * currentChunk;
      end = Math.min(size, start + bytePerChuck);
    }
  }

  function closeMessage() {
    setShowMessages(false);
  }
  function upDateMessages(peer, type, data) {
    setMessages((prev) => [
      ...prev,
      {
        peer,
        id: Math.random(),
        message: { type, data },
      },
    ]);
  }

  function scrollToBottom() {
    if (scrollToViewRef.current) {
      scrollToViewRef.current.scrollIntoView(false);
    }
  }

  function addMessage() {
    upDateMessages("local", "text", message);
    setMessage("");

    if (dataChannel) {
      dataChannel.send(JSON.stringify(message));
    }
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!channelOpened) {
    return (
      <div className="flex flex-col sm:basis-[16rem] grow-[1]">
        <div className="flex  justify-end p-2">
          <button onClick={closeMessage}>
            <img className="w-8 " src="./assets/close.png" alt="close button" />
          </button>
        </div>
        <div className="grow flex items-center ">
          <p className="grow text-center text-xl ">Connecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative sm:basis-[16rem] grow-[1]  bg-white h-full">
      {showMessages ? (
        <div className=" sm:hidden shadow-md w-full h-20 z-50">
          <Video stream={stream} />
        </div>
      ) : null}

      {imageModalOpen ? (
        <FileModal {...{ file, handleFileUpload, setImageModalOpen }} />
      ) : null}

      <div className="flex justify-end p-2">
        <button onClick={closeMessage}>
          <img className="w-8 " src="./assets/close.png" alt="close button" />
        </button>
      </div>

      <Messages messages={messages} />
      <ChatInput {...{ handleFile, message, setMessage, addMessage }} />
    </div>
  );
}
