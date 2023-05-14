const url = "ws://localhost:3000";
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

const constraints = {
  audio: true,
  video: {
    width: { ideal: 1920 },
    height: { ideal: 1080 },
  },
};

export const funcObject = {
  userJoined: () => addTrackToPeerConn(),
  offer: handleOffer,
  answer: setRemoteDesc,
  candidate: handleIceCandidate,
};

async function getMedia({ videoinput, audioinput }) {
  const constraints = {
    video: {
      deviceId: videoinput,
    },
    audio: {
      deviceId: audioinput,
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
  rtc.addIceCandidate(res.candidate);
}

function handleOffer(res) {
  if (rtc.signalingState !== "stable") {
    return;
  }
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
