import React, { useEffect, useRef, useState } from "react";

const wsConn = new WebSocket("ws://localhost:3000");
const subscribers = {};

export default function useWebSocket() {
  function subscribe(message, callback) {
    subscribers[message] = callback;
  }

  useEffect(() => {
    wsConn.onmessage = (event) => {
      const message = JSON.parse(event.data);
      const callback = subscribers[message.type];
      if (callback) {
        callback(message);
      }
    };

    wsConn.sendJson = (data) => {
      wsConn.send(JSON.stringify(data));
    };
  }, []);
  return { wsConn, subscribe, subscribers };
}
