const url = "wss://chatmebackend.onrender.com";
const iceServers = [
  {
    urls: "stun:stun1.l.google.com",
  },
  {
    urls: "stun:stun2.l.google.com",
  },
];

export const localStream = new MediaStream();
export const remoteStream = new MediaStream();
const conn = new WebSocket(url);

conn.onmessage = handleMessage;

let rtc;

export function Init(selectedDevices) {
  rtc = new RTCPeerConnection({
    iceServers,
  });

  addTrackToLocalStream(selectedDevices);
  rtc.onnegotiationneeded = createOffer;
  rtc.onicecandidate = sendIceCandidate;
  rtc.onconnectionstatechange = closeSocketConnection;
  rtc.ontrack = addTrackToRemoteStream;
  return rtc;
}

export const funcObject = {
  userJoined: () => addTrackToPeerConn(),
  offer: handleOffer,
  answer: setRemoteDesc,
  candidate: handleIceCandidate,
};

async function getMedia(selected) {
  const constraints = {
    video: {
      deviceId: selected?.videoinput,
    },
    audio: {
      deviceId: selected?.audioinput,
    },
    echoCancellation: true,
  };
  const stream = await navigator.mediaDevices.getUserMedia(constraints);
  return stream;
}

function addTrackToLocalStream(selectedDevices) {
  getMedia(selectedDevices).then((stream) => {
    stream.getTracks().forEach((track) => {
      if (track.kind === "audio") return;
      localStream.addTrack(track);
    });
  });
}

function addTrackToRemoteStream(track) {
  if (track.kind === "audioinput") return;
  remoteStream.addTrack(track);
}

function sendIceCandidate(event) {
  if (event.candidate) {
    conn.send(
      JSON.stringify({ type: "candidate", candidate: event.candidate })
    );
  }
}

function closeSocketConnection() {
  if (rtc.connectionState === "connected") {
    conn.close();
  }
}

function handleMessage(event) {
  const res = JSON.parse(event.data);
  const functionToRun = funcObject[res.type];
  if (functionToRun) {
    functionToRun(res);
  }
}

function handleIceCandidate(res) {
  if (rtc.signalingState !== "stable") {
    return;
  }
  console.log(res.candidate);
  rtc.addIceCandidate(res.candidate);
}

function handleOffer(res) {
  if (rtc.signalingState !== "stable") {
    return;
  }
  console.log(res);
  setRemoteDesc(res);
  addTrackToPeerConn(createAnswer);
}

function addTrackToPeerConn(callback) {
  getMedia().then((stream) => {
    stream.getTracks().forEach((track) => {
      rtc.addTrack(track, stream);
    });
    if (callback) {
      callback();
    }
  });
}

function setRemoteDesc(res) {
  if (!rtc.remoteDescription) {
    rtc.setRemoteDescription(res);
  }
}

function createAnswer() {
  rtc.createAnswer().then((answer) => {
    handlelocalDesc(answer);
  });
}

function createOffer() {
  rtc.createOffer().then((offer) => {
    handlelocalDesc(offer);
  });
}

function handlelocalDesc(description) {
  rtc.setLocalDescription(description);
  conn.send(JSON.stringify(description));
}

export function send(data) {
  conn.send(JSON.stringify(data));
}
