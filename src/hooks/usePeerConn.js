import React, { useEffect, useState } from "react";

const localStream = new MediaStream();

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
  // const [localStream, setLocalStream] = useState();
  const [remoteStream, setRemoteStream] = useState(new MediaStream());
  const [conn, setConn] = useState();
  const [dataChannel, setDataChannel] = useState();

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
      addTrackToPeerConn();
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
          await peerConn.setRemoteDescription(res.description);
          await addTrackToPeerConn();
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

    function registerChannelEvents(dataChannel) {
      dataChannel.onmessage = (event) => {
        console.log(showMessages);
        if (!showMessages) {
          setNoOfNewMessages((prev) => prev + 1);
        }
        setMessages((prev) => [
          ...prev,
          { peer: "remote", message: event.data },
        ]);
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
      localStream.getTracks().forEach((track) => {
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
