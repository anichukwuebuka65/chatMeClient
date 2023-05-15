import React, { useEffect, useState } from "react";
import Video from "./Video";
import { localStream, remoteStream } from "./RTCPeerConn";

export default function VideoContainer({ isStream }) {
  return (
    <div className="relative flex flex-col items-center justify-center h-screen bg-[#837272]">
      <Video stream={localStream} />
      {isStream ? (
        <div className="border border-[#a97cce] shadow-md absolute w-1/3 aspect-square sm:aspect-video lg:w-1/4 md:top-8 top-4 lg:left-8 left-4 rounded-lg overflow-hidden">
          <Video stream={remoteStream} />
        </div>
      ) : null}
    </div>
  );
}
