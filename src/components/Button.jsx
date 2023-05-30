import React, { useState } from "react";

export default function Button({ src, color, handler, btn, noOfNewMessages }) {
  const [active, setActive] = useState(true);

  function handleClick() {
    setActive((prev) => !prev);
    handler();
  }

  return (
    <button
      className={`${color ?? "bg-blue-900"} relative w-12 rounded-full p-2`}
    >
      {noOfNewMessages > 0 ? (
        <span className="absolute bg-white rounded-full inline-block h-6 w-6 font-bold">
          {noOfNewMessages}
        </span>
      ) : null}

      <img onClick={handleClick} src={src} />
      {!active && btn !== "messages" ? (
        <span
          className={`absolute top-1/2 inline-block rotate-45 left-0 pt-0.5  w-12 ${
            color ?? "bg-blue-900"
          }`}
        >
          <span className="bg-black block h-0.5 w-full"></span>
        </span>
      ) : null}
    </button>
  );
}
