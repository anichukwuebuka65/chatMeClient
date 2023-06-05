import React from "react";

export default function Messages({ messages, scrollToViewRef }) {
  return (
    <div
      style={{ height: "calc(100vh - 7rem)" }}
      className="overflow-y-auto rounded shadow-sm p-2"
    >
      {messages.map(({ peer, id, message }, index) => {
        const { type, data } = message;

        return (
          <div
            ref={index + 1 == messages.length ? scrollToViewRef : null}
            key={id}
            className={`flex my-4 ${
              peer === "local" ? "justify-end " : "justify-start"
            }`}
          >
            <span
              className={` flex max-w-[70%] px-3 py-1 rounded-md shadow-md bg-[#ffffff]
              }`}
            >
              {type.includes("image") ? (
                <img src={data} />
              ) : type.includes("audio") ? (
                <audio className="w-full" src={data} controls />
              ) : type.includes("video") ? (
                <video src={data} controls />
              ) : (
                data
              )}
            </span>
          </div>
        );
      })}
    </div>
  );
}
