import React, { useRef, useState } from "react";
import { send } from "../components/Video/RTCPeerConn";

function Login({ roomNotFound }) {
  const roomIdRef = useRef();

  function joinRoom() {
    send({ type: "joinRoom", roomId: roomIdRef.current.value });
  }

  function createRoom() {
    send({ type: "createRoom" });
  }

  return (
    <div>
      {roomNotFound && <p>Room not found, pls create a new room</p>}
      <form>
        <label htmlFor="roomId"></label>
        <input id="roomId" ref={roomIdRef} type="text" />
        <button type="button" onClick={joinRoom}>
          Join Room
        </button>
        <button type="button" onClick={createRoom}>
          Create Room
        </button>
      </form>
    </div>
  );
}

export default Login;
