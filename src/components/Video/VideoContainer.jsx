import React from "react";
import Video from "./Video";
import { localStream, remoteStream } from "./RTCPeerConn";

export default function VideoContainer() {
  return (
    <div className="flex flex-col justify-center h-screen bg-[#000]">
      <div className="relative  md:max-h-screen rounded-sm overflow-hidden">
        <Video stream={localStream} />
        <div className="border border-white absolute w-3/4 md:w-1/4 md:top-8 top-6 lg:left-16 left-4 rounded-lg overflow-hidden">
          <Video stream={remoteStream} />
        </div>
      </div>
    </div>
  );
}
