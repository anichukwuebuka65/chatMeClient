import React, { useEffect, useRef, useState } from "react";

const localUrl = "ws://localhost:3000";
const prodUrl = "wss://chatmebackend.onrender.com";

export default function useWebSocket() {
  const [wsConn, setWsConn] = useState();
  const [subscribers, setSubscribers] = useState({});

  function subscribe(message, callback) {
    setSubscribers((prev) => ({ ...prev, [message]: callback }));
  }

  useEffect(() => {
    const conn = new WebSocket(prodUrl);
    conn.onmessage = (event) => {
      const message = JSON.parse(event.data);
      const callback = subscribers[message.type];
      if (callback) {
        callback(message);
      }
    };
    conn.sendJson = (data) => {
      conn.send(JSON.stringify(data));
    };

    setWsConn(conn);
  }, [subscribers]);
  return { wsConn, subscribe, subscribers };
}
