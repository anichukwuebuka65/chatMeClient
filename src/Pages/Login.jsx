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
    <h1 className="text-2xl">LitChat</h1>
   <p>chat with your buddies</p>
      {roomNotFound && <p>Room not found, pls create a new room</p>}
      <form>
        <label htmlFor="roomId"></label>
        <input className="border-2 border-blue-600" id="roomId" ref={roomIdRef} type="text" />
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
