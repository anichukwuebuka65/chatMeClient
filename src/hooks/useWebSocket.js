import React, { useEffect, useState } from "react";

const localUrl = "ws://localhost:3000";
const prodUrl = "wss://chatmebackend.onrender.com";
const subscribers = {};

export default function useWebSocket() {
  const [wsConn, setWsConn] = useState();

  function subscribe(message, callback) {
    subscribers[message] = callback;
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
  }, []);
  return { wsConn, subscribe, subscribers };
}
