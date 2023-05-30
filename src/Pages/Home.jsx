import React, { useEffect, useState } from "react";
import VideoContainer from "../components/Video/VideoContainer";
import usePeerConn from "../hooks/usePeerConn";
import Chat from "../components/Chat/Chat";

export default function Home({ wsConn, iceServers, subscribe, roomId }) {
  if (iceServers.length === 0) return <p> ice server error, try again</p>;
  const [isStream, setIsStream] = useState(false);
  const [messages, setMessages] = useState([]);
  const [channelOpened, setChannelOpened] = useState(false);
  const [noOfNewMessages, setNoOfNewMessages] = useState(0);
  const [showMessages, setShowMessages] = useState(false);

  const { localStream, remoteStream, conn, dataChannel } = usePeerConn(
    subscribe,
    iceServers,
    wsConn,
    setIsStream,
    setChannelOpened,
    setMessages,
    setNoOfNewMessages,
    showMessages
  );
  console.log(showMessages);

  return (
    <div
      style={{ width: "calc(100vw)" }}
      className={`${
        showMessages ? "" : "w-screen"
      } overflow-hidden flex h-full`}
    >
      <div
        className={` ${
          showMessages ? "hidden" : ""
        } sm:block sm:basis-[24rem] grow-[3] h-full relative text-[#211e31] bg-[#fff]`}
      >
        <div className=" absolute left-2 top-0 z-50 bg-white my-2 p-1 rounded-sm">
          <p>Room id: {roomId}</p>
        </div>
        <VideoContainer
          {...{
            localStream,
            remoteStream,
            conn,
            wsConn,
            setIsStream,
            showMessages,
            setShowMessages,
            noOfNewMessages,
          }}
          isStream={isStream}
        />
      </div>
      {showMessages ? (
        <Chat
          {...{
            messages,
            showMessages,
            setMessages,
            setShowMessages,
            dataChannel,
            channelOpened,
            stream: isStream ? remoteStream : localStream,
          }}
        />
      ) : null}
    </div>
  );
}
