import React, { useState } from "react";

export default function Button({ src, color, handler, btn }) {
  const [active, setActive] = useState(true);

  function handleClick() {
    setActive((prev) => !prev);
    handler();
  }

  return (
    <button className="relative">
      <img
        onClick={handleClick}
        className={`${color ?? "bg-blue-900"} rounded-full p-2 w-10 md:w-12`}
        src={src}
      />
      {!active && btn !== "messages" ? (
        <div
          className={`absolute top-1/2 pt-0.5 rotate-45 w-10 ${
            color ?? "bg-blue-900"
          }`}
        >
          <div className="bg-black h-0.5 w-full"></div>
        </div>
      ) : null}
    </button>
  );
}
