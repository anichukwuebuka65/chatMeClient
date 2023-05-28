import React from "react";
import Button from "./Button";

export default function Controls({
  localStream,
  conn,
  wsConn,
  setIsStream,
  showMessages,
  setShowMessages,
}) {
  function toggleVideo() {
    const videoTrack = localStream.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
    }
  }

  function toggleAudio() {
    const audioTrack = localStream.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
    }
  }

  function endCall() {
    conn.close();
    wsConn.close();
    setIsStream(false);
  }

  function displayMessages() {
    setShowMessages((prev) => !prev);
  }

  return (
    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-8">
      <Button handler={toggleVideo} src={"./assets/video.png"} />
      <Button handler={toggleAudio} src={"./assets/mic.png"} />
      <Button
        handler={displayMessages}
        src={"./assets/chat.png"}
        color={showMessages ? "bg-white" : "bg-blue-900"}
        btn="messages"
      />
      <Button
        handler={endCall}
        src={"./assets/endCall.png"}
        color={"bg-red-900"}
      />
    </div>
  );
}
