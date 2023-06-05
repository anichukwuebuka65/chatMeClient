import React, { useEffect, useRef, useState } from "react";

const localStream = new MediaStream();
let receivingBinary = false;
let binaryMetaData;
let binary = [];
let receivedByteLength = 0;

export default function usePeerConn(
  subscribe,
  iceServers,
  wsConn,
  setIsStream,
  setChannelOpened,
  setMessages,
  setNoOfNewMessages,
  showMessages
) {
  const [remoteStream, setRemoteStream] = useState(new MediaStream());
  const [conn, setConn] = useState();
  const [dataChannel, setDataChannel] = useState();
  let trackAdded = useRef(false);

  useEffect(() => {
    let polite = true;

    subscribe("candidate", handleCandidate);
    subscribe("description", handleDescription);
    subscribe("user left", () => {
      setIsStream(false);
    });

    const peerConn = new RTCPeerConnection({ iceServers });

    subscribe("userJoined", async () => {
      polite = false;
      await addTrackToPeerConn();
      trackAdded.current = true;
    });

    addTrackToLocalStream();

    peerConn.onnegotiationneeded = async () => {
      await peerConn.setLocalDescription();
      wsConn.sendJson({
        type: "description",
        description: peerConn.localDescription,
      });
    };

    peerConn.onconnectionstatechange = () => {
      if (peerConn.connectionState === "disconnected") {
        setIsStream(false);
      }
      if (peerConn.connectionState == "connected") {
        if (!polite) {
          const channel = peerConn.createDataChannel("messages");
          registerChannelEvents(channel);
          setDataChannel(channel);
        } else {
          peerConn.ondatachannel = (event) => {
            registerChannelEvents(event.channel);
            setDataChannel(event.channel);
          };
        }
      }
    };

    peerConn.ontrack = ({ track }) => {
      remoteStream.addTrack(track);
      setIsStream(true);
    };

    peerConn.onicecandidate = (event) => {
      wsConn.sendJson({ type: "candidate", candidate: event.candidate });
    };

    setConn(peerConn);

    async function handleDescription(res) {
      if (res.description.type == "offer") {
        if (peerConn.signalingState !== "stable") {
          return;
        }
        try {
          if (!trackAdded.current) {
            await addTrackToPeerConn();
          }
          await peerConn.setRemoteDescription(res.description);
          await peerConn.setLocalDescription();
          wsConn.sendJson({
            type: "description",
            description: peerConn.localDescription,
          });
        } catch (err) {
          console.log(err.message);
        }
      } else {
        await peerConn.setRemoteDescription(res.description);
      }
    }

    function getImg(data) {
      if (data.type === "img") {
        return URL.createObjectURL(data.data);
      }
      return data.data;
    }

    function handleFiles(data) {
      if (receivedByteLength < binaryMetaData.size) {
        binary.push(data);
        receivedByteLength += data.size;
        if (data.size === 1200) return;
      }

      let blob = new Blob(binary);
      let url = URL.createObjectURL(blob);
      setMessages((prev) => [
        ...prev,
        {
          peer: "remote",
          id: Math.random(),
          message: { type: binaryMetaData.type, data: url },
        },
      ]);
      binary = [];
      binaryMetaData;
      receivingBinary = false;
      receivedByteLength = 0;
    }

    function handleText(data) {
      setMessages((prev) => [
        ...prev,
        {
          peer: "remote",
          id: Math.random(),
          message: { type: "text", data },
        },
      ]);
    }

    function registerChannelEvents(dataChannel) {
      dataChannel.onmessage = (event) => {
        try {
          const parsedData = JSON.parse(event.data.toString());
          if (typeof parsedData !== "object") {
            return handleText(parsedData);
          }
          if (receivingBinary == false) {
            binaryMetaData = parsedData;
            receivingBinary = true;
            return;
          }
        } catch (err) {
          console.log(err.message);
        }

        handleFiles(event.data);
      };

      dataChannel.onopen = () => {
        setChannelOpened(true);
      };
    }

    function handleCandidate(res) {
      if (res.type === "candidate" && res.candidate) {
        peerConn.addIceCandidate(res.candidate);
      }
    }

    async function addTrackToLocalStream() {
      const stream = await getMedia();
      stream.getTracks().forEach((track) => {
        localStream.addTrack(track);
      });
    }

    async function getMedia() {
      const constraints = {
        video: true,
        audio: true,
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      return stream;
    }

    async function addTrackToPeerConn() {
      const stream = await getMedia();
      localStream.getTracks().forEach((track) => {
        if (track.seen) return;
        track.seen = true;
        peerConn.addTrack(track);
      });
    }
  }, [showMessages]);

  return {
    localStream,
    remoteStream,
    conn,
    dataChannel,
  };
}
