import React, { useEffect, useRef } from "react";

export default function Video({ stream }) {
  const videoRef = useRef();

  useEffect(() => {
    videoRef.current.srcObject = stream;
  });
  return (
    <>
      <video
        className=" bg-slate-500"
        ref={videoRef}
        playsInline
        controls
        autoPlay
      ></video>
    </>
  );
}
