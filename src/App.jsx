import { useEffect, useState } from "react";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import { funcObject } from "./components/Video/RTCPeerConn";

function App() {
  const [page, setPage] = useState("login");
  const [roomId, setRoomId] = useState();
  const [roomNotFound, setRoomNotFound] = useState(false);

  useEffect(() => {
    funcObject["roomJoined"] = (res) => {
      if (!res.roomId) {
        return setRoomNotFound(true);
      }
      setPage("home");
      setRoomId(res.roomId);
    };
  }, []);

  return (
    <div>
      {page === "login" && <Login roomNotFound={roomNotFound} />}
      {page === "home" && <Home roomId={roomId} />}
    </div>
  );
}

export default App;
