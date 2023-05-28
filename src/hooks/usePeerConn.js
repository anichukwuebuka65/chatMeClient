import React, { useEffect, useState } from "react";

export default function usePeerConn(
  subscribe,
  iceServers,
  wsConn,
  setIsStream,
  setMessages
) {
  const [localStream] = useState(new MediaStream());
  const [remoteStream] = useState(new MediaStream());
  const [conn, setConn] = useState();
  const [dataChannel, setDataChannel] = useState();
  const [channelSubscribers, setChannelSubscribers] = useState([]);

  function subscribeToData(fn) {
    setChannelSubscribers((state) => [...state, fn]);
  }

  if (dataChannel) {
    dataChannel.onmessage = (event) => {
      console.log("message");
      channelSubscribers.forEach((fn) => fn(event.data));
    };
  }

  useEffect(() => {
    let polite = true;

    subscribe("candidate", handleCandidate);
    subscribe("description", handleDescription);
    subscribe("user left", () => {
      setIsStream(false);
    });

    const peerConn = new RTCPeerConnection({ iceServers });
    setConn(peerConn);

    subscribe("userJoined", async () => {
      polite = false;
      addTrackToPeerConn();
    });

    addTrackToLocalStream();

    // dataChannel.onmessage = (event) => {
    //   setMessages((prev) => [
    //     ...prev,
    //     {
    //       peer: "remote",
    //       message: event.data,
    //     },
    //   ]);
    // };

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
          setDataChannel(peerConn.createDataChannel("messages"));
        } else {
          peerConn.ondatachannel = (event) => {
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

    async function handleDescription(res) {
      if (res.description.type == "offer") {
        if (peerConn.signalingState !== "stable") {
          return;
        }

        addTrackToPeerConn();

        try {
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

    function handleCandidate(res) {
      if (res.type === "candidate" && res.candidate) {
        peerConn.addIceCandidate(res.candidate);
      }
    }

    function addTrackToLocalStream() {
      getMedia().then((stream) => {
        stream.getTracks().forEach((track) => {
          if (track.kind === "audio") return;
          localStream.addTrack(track);
        });
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
      stream.getTracks().forEach((track) => {
        peerConn.addTrack(track);
      });
    }
  }, []);

  return {
    localStream,
    remoteStream,
    conn,
    subscribeToData,
    dataChannel,
  };
}
