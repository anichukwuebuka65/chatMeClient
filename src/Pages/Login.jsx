import React, { useRef, useState } from "react";

function Login({ wsConn, roomId }) {
  const roomIdRef = useRef();
  const [err, setError] = useState("");

  function joinRoom() {
    if (!roomIdRef.current.value) return setError("Pls enter the room id ");
    wsConn.sendJson({ type: "joinRoom", roomId: roomIdRef.current.value });
  }

  function createRoom() {
    wsConn.sendJson({ type: "createRoom" });
  }

  return (
    <div
      style={{ width: "min(100%, 28rem)" }}
      className=" rounded-md mx-4 p-4 bg-[#1f1c1c] text-center text-[#c0b0b0]"
    >
      <h1 className="text-4xl tracking-wider font-[600] mb-2">LitChat</h1>
      <p className="text-[#ffffff] italic text-sm">
        chat with your buddies and family
      </p>
      {!roomId && <p>Room not found, pls create a new room</p>}
      <form className="grid gap-6">
        <label htmlFor="roomId"></label>
        <div className="grid w-full">
          <input
            className={` ${
              err ? "border-2 border-red-900" : ""
            }  rounded-md p-2`}
            id="roomId"
            ref={roomIdRef}
            type="text"
          />
          {err && <p className="text-sm text-red-500">{err}</p>}
        </div>

        <button
          className="bg-[#331c66] text-lg rounded-md py-2"
          type="button"
          onClick={joinRoom}
        >
          Join Room
        </button>
        <button
          className="rounded py-2 bg-[#28742e] text-lg"
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
