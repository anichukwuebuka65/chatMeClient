import React, { useRef, useState } from "react";

export default function Chat({
  setShowMessages,
  setMessages,
  showMessages,
  messages,
  stream,
  dataChannel,
}) {
  const [message, setMessage] = useState("");
  const scrollToViewRef = useRef();

  function closeMessage() {
    setShowMessages(false);
  }

  function addMessage() {
    setMessages((prev) => [...prev, { peer: "local", message }]);
    setMessage("");
    if (scrollToViewRef.current) {
      scrollToViewRef.current.scrollIntoView({ alignToTop: false });
    }
    if (dataChannel) dataChannel.send(message);
  }

  return (
    <div className="relative sm:basis-[16rem] grow-[1]  bg-white h-full">
      {/* {showMessages ? (
        <div className="border border-[#a97cce] sm:hidden shadow-md absolute w-24 aspect-square sm:aspect-video lg:w-1/4 md:top-8 top-4 lg:left-8 left-4 rounded-lg overflow-hidden z-50">
          <Video stream={stream} />
        </div>
      ) : null} */}

      <div className="flex justify-end p-2">
        <button onClick={closeMessage}>
          <img className="w-8 " src="./assets/close.png" alt="close button" />
        </button>
      </div>
      <div
        style={{ height: "calc(100vh - 7rem)" }}
        className="overflow-y-auto rounded shadow-sm p-2"
      >
        {messages.map((message, index) => {
          return (
            <div
              ref={index == messages.length - 1 ? scrollToViewRef : null}
              key={message.message}
              className={`flex my-4 ${
                message.peer === "local" ? "justify-end " : "justify-start"
              }`}
            >
              <span
                className={` flex max-w-[20rem] px-3 py-1 rounded-md shadow-md bg-[#ffffff]
              }`}
              >
                {message.message}
              </span>
            </div>
          );
        })}
      </div>

      <div className="absolute flex gap-4 sm:gap-2 left-0 right-0  p-2 bottom-0 bg-[#e7dddd] shadow-sm">
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
    </div>
  );
}
