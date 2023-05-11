import React, { useEffect, useRef } from "react";

export default function Video({ stream }) {
  const videoRef = useRef();

  useEffect(() => {
    videoRef.current.srcObject = stream;
  });
  return (
    <div>
      <video className="bg-black" ref={videoRef} controls autoPlay></video>
    </div>
  );
}
