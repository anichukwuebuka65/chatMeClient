import React, { useEffect, useMemo, useRef, useState } from "react";

function Home({ wsConn, roomId }) {
  const roomIdRef = useRef();
  const [err, setError] = useState("");
  const [connOpen, setConnOpen] = useState(false);

  function joinRoom(e) {
    if (!roomIdRef.current.value) return setError("Pls enter the room id ");
    wsConn.sendJson({ type: "joinRoom", roomId: roomIdRef.current.value });
  }

  function createRoom() {
    wsConn.sendJson({ type: "createRoom" });
  }

  const memoizedConn = useMemo(() => wsConn, [wsConn]);

  useEffect(() => {
    if (wsConn) {
      wsConn.onopen = () => {
        setConnOpen(true);
      };
    }
  }, [memoizedConn]);

  return (
    <div className="min-h-screen bg-black w-full">
      <div className="flex justify-between p-6 bg-[#0e0d0d]">
        <p className="text-[#beafaf] text-5xl font-bold">LitChat</p>
        <div>
          <button
            onClick={createRoom}
            className="bg-[#1d266e] text-[#e0d8d8] text-3xl py-3 px-5 rounded-md"
          >
            Create Room
          </button>
        </div>
      </div>
      <div
        style={{ minHeight: "calc(100vh - 110px)" }}
        className="flex flex-col md:flex-row text-[#beafaf] py-16 px-10"
      >
        <div className="grow basis3/5 flex items-center justify-center text-[28px] leading-7 bg-[#080808] p-4 rounded-sm font-semibold">
          <div>
            <p className="mb-6">- Connect with peers in real time on video.</p>
            <p className="mb-6">- Send messages to each other in real time.</p>
            <p className="mb-6">- Share pictures and files with each other.</p>
            <p className="mb-6">
              - Be sure of privacy as connection is directly between peers.{" "}
            </p>
          </div>
        </div>
        <div className="grow basis-2/5 bg-[#080808] gap-6 p-6 pt-12">
          <div className="grid gap-6 w-full p-6 bg-[#020202] rounded-sm">
            {!connOpen ? (
              <p className="text-[#ffffff] italic text-sm">
                Making webSocket connection...
              </p>
            ) : null}
            {!roomId && <p>Room not found, pls create a new room</p>}
            <div className="grid gap-6">
              <input
                className={` ${
                  err ? "border-2 border-red-900" : ""
                }  rounded-md h-12 px-4 text-xl`}
                id="roomId"
                ref={roomIdRef}
                type="text"
                placeholder="room id"
              />
              {err && <p className="text-sm text-red-500">{err}</p>}
              <button
                disabled={!connOpen}
                className={`${
                  !connOpen && "cursor-not-allowed bg-[#a03232]"
                } bg-[#802626] text-2xl font-bold py-3 rounded-md `}
                type="submit"
                onClick={joinRoom}
              >
                join room
              </button>
            </div>
            <div className="grid">
              <button
                disabled={!connOpen}
                className={`${
                  !connOpen && "cursor-not-allowed bg-[#283599]"
                } bg-[#1d266e] py-3 rounded-md text-2xl font-bold`}
                type="submit"
                onClick={createRoom}
              >
                create room
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
