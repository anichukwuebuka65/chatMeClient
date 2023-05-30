import React from "react";
import Controls from "../Controls";
import Video from "./Video";

function VideoContainer({
  localStream,
  remoteStream,
  isStream,
  setIsStream,
  conn,
  wsConn,
  showMessages,
  setShowMessages,
  noOfNewMessages,
}) {
  const localStr = !isStream ? localStream : remoteStream;
  const remoteStr = isStream ? localStream : null;

  return (
    <div className="relative h-full bg-[#0c0b0b]">
      <div className={`${showMessages ? "hidden sm:block" : null} h-full`}>
        <Video stream={localStr} local />
        <Controls
          {...{
            setIsStream,
            wsConn,
            conn,
            localStream,
            showMessages,
            setShowMessages,
            noOfNewMessages,
          }}
        />
      </div>

      {isStream ? (
        <div className="border border-[#a97cce] shadow-md absolute w-32 md:w-1/4 aspect-square sm:aspect-video lg:w-1/4 md:top-12 top-4 lg:left-8 right-4 rounded-lg overflow-hidden z-50">
          <Video stream={remoteStr} />
        </div>
      ) : null}
    </div>
  );
}

export default React.memo(VideoContainer);
