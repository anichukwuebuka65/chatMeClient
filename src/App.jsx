import { useEffect, useState } from "react";
import Main from "./Pages/Main";
import Home from "./Pages/Home";
import useWebSocket from "./hooks/useWebSocket";

function App() {
  const [page, setPage] = useState("login");
  const { wsConn, subscribe, subscribers } = useWebSocket();
  const [roomId, setRoomId] = useState(1);
  const [iceServers, setIceServers] = useState([]);

  const apiKey = "2948b8a31f90c2bf0162c1f9c4dc3845bdb1";

  function getPage(page) {
    const pageComponents = {
      login: <Home {...{ setPage, wsConn, roomId }} />,
      home: (
        <Main {...{ wsConn, iceServers, subscribers, subscribe, roomId }} />
      ),
    };

    return pageComponents[page];
  }

  function navigateHome(res) {
    if (!res.roomId) {
      return setRoomId(null);
    }
    setPage("home");
    setRoomId(res.roomId);
  }

  useEffect(() => {
    async function getIceServers() {
      const res = await fetch(
        "https://chatme.metered.live/api/v1/turn/credentials?apiKey=" + apiKey
      );
      const data = await res.json();
      return data.slice(0, 2);
    }
    getIceServers().then((servers) => {
      setIceServers(servers);
    });
    subscribe("roomJoined", navigateHome);
  }, []);

  return (
    <div className=" min-h-screen flex items-center justify-center">
      {getPage(page)}
    </div>
  );
}

export default App;
