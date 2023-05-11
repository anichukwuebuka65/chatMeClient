import React from "react";
import Video from "./Video";
import { localStream, remoteStream } from "./RTCPeerConn";

export default function VideoContainer() {
  return (
    <div className="relative">
      <div className="">
        <Video stream={localStream} />
      </div>
      <div className="absolute w-1/3 top-8 left-8 rounded-lg overflow-hidden">
        <Video stream={localStream} />
      </div>
    </div>
  );
}
