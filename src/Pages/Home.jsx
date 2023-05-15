import React, { useEffect, useState } from "react";
import VideoContainer from "../components/Video/VideoContainer";
import {
  Init,
  getTurnServers,
  addTrackToRemoteStream,
} from "../components/Video/RTCPeerConn";

export default function Home({ roomId }) {
  const [isStream, setIsStream] = useState(false);

  function filterDuplicates(items) {
    const tempArr = [];
    return items.filter((item) => {
      const isDuplicate = tempArr.includes(item.deviceId);
      tempArr.push(item.deviceId);
      return !isDuplicate;
    });
  }

  function getRemoteStream(rtc) {
    rtc.ontrack = ({ track }) => {
      addTrackToRemoteStream(track);
      setIsStream(true);
    };
  }

  useEffect(() => {
    getTurnServers().then((servers) => {
      const rtc = Init(servers);
      getRemoteStream(rtc);
    });
  }, []);

  return (
    <div className="relative text-[#211e31] bg-[#fff]">
      <div className="absolute right-2 top-0 z-50 bg-white my-2 p-1 rounded-sm">
        <p>Room id: {roomId}</p>
      </div>
      <VideoContainer isStream={isStream} />
    </div>
  );
}
