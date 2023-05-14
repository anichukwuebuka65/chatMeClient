import React, { useEffect } from "react";
import { remoteStream } from "../components/Video/RTCPeerConn";

export default function useRegisterStreamEvent(event, fn) {
  useEffect(() => {
    remoteStream.addEventListener(event, fn);
    // return () => {
    //   remoteStream.removeEventListener(event, fn);
    // };
  }, []);
}
