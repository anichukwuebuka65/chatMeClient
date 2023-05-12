import React, { useEffect, useRef } from "react";

export default function Video({ stream }) {
  const videoRef = useRef();

  useEffect(() => {
    videoRef.current.srcObject = stream;
  });
  return (
    <>
      <video
        className=" bg-[#000] h-full md:object-contain"
        ref={videoRef}
        playsInline
        autoPlay
      ></video>
    </>
  );
}
