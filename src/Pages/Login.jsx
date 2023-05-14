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
    <div className=" rounded-md min-w-[25rem] p-2 md:p-4 bg-[#111010] text-[#c0b0b0]">
      <h1 className="text-2xl">LitChat</h1>
      <p>chat with your buddies</p>
      {roomNotFound && <p>Room not found, pls create a new room</p>}
      <form className="grid gap-4">
        <label htmlFor="roomId"></label>
        <input
          className="border-2 border-blue-600 rounded-md p-2"
          id="roomId"
          ref={roomIdRef}
          type="text"
        />
        <button
          className="bg-[#201733] rounded-md py-2"
          type="button"
          onClick={joinRoom}
        >
          Join Room
        </button>
        <button
          className="rounded py-2 bg-[#28742e]"
          type="button"
          onClick={createRoom}
        >
          Create Room
        </button>
      </form>
    </div>
  );
}

export default Login;
