import React, { useEffect, useRef } from "react";

export default function Video({ stream }) {
  const videoRef = useRef();

  useEffect(() => {
    videoRef.current.srcObject = stream;
  });
  return (
    <>
      <video
        className=" bg-[#000000] h-full w-full object-cover "
        ref={videoRef}
        playsInline
        autoPlay
      ></video>
    </>
  );
}
