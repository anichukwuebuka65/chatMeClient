import React, { useEffect, useState } from "react";
import VideoContainer from "../components/Video/VideoContainer";
import { Init } from "../components/Video/RTCPeerConn";

export default function Home({ roomId }) {
  const [remoteStream, setRemoteStream] = useState();

  useEffect(() => {
    const rtc = Init();
    rtc.ontrack = ({ streams }) => {
      console.log("track");
      setRemoteStream(streams[0]);
    };
  }, []);

  return (
    <div className=" bg-[#fff]">
      <div className="">Room id: {roomId}</div>
      <VideoContainer remoteStream={remoteStream} />
    </div>
  );
}
