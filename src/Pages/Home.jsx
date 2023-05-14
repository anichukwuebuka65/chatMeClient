import React, { useEffect, useState } from "react";
import VideoContainer from "../components/Video/VideoContainer";
import { Init } from "../components/Video/RTCPeerConn";

export default function Home({ roomId }) {
  const [remoteStream, setRemoteStream] = useState();
  const [devices, setDevices] = useState([]);
  const [selectedDevices, setSelectedDevices] = useState({});

  function handleSelect(devices) {
    setSelectedDevices((prev) => ({
      ...prev,
      [devices.kind]: devices.deviceId,
    }));
  }

  useEffect(() => {
    const rtc = Init(selectedDevices);
    rtc.ontrack = ({ streams }) => {
      setRemoteStream(streams[0]);
    };
    navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => setDevices(devices));
  }, [selectedDevices]);

  return (
    <div className="relative text-[#211e31] bg-[#fff]">
      <div className="absolute right-2 top-0 z-50 bg-white my-2 p-1 rounded-sm">
        <p>Room id: {roomId}</p>
        {devices[0]?.label && (
          <>
            <label className="block text-sm" htmlFor="device">
              Choose a device:
            </label>
            <select className=" p-1 text-sm rounded-sm" id="device">
              {devices.map((device) => (
                <option
                  onClick={() => handleSelect(device)}
                  key={device.deviceId}
                >
                  {device.label}
                </option>
              ))}
            </select>
          </>
        )}
      </div>
      <VideoContainer remoteStream={remoteStream} />
    </div>
  );
}
