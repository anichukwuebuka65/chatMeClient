const url = "wss://chatmebackend.onrender.com";
const url2 = "ws://localhost:3000";

export const localStream = new MediaStream();
export const remoteStream = new MediaStream();
const conn = new WebSocket(url);

conn.onmessage = handleMessage;

export let rtc;

export function Init(turnServers) {
  rtc = new RTCPeerConnection({
    iceServers: turnServers,
  });

  addTrackToLocalStream();
  rtc.onnegotiationneeded = createOffer;
  rtc.onicecandidate = sendIceCandidate;
  rtc.onconnectionstatechange = closeSocketConnection;
  return rtc;
}

export const funcObject = {
  userJoined: () => addTrackToPeerConn(),
  offer: handleOffer,
  answer: setRemoteDesc,
  candidate: handleIceCandidate,
};

export async function getTurnServers() {
  const apiKey = "2948b8a31f90c2bf0162c1f9c4dc3845bdb1";

  const res = await fetch(
    "https://chatme.metered.live/api/v1/turn/credentials?apiKey=" + apiKey
  );
  const data = await res.json();
  return data.slice(0, 2);
}

async function getMedia() {
  const constraints = {
    video: true,
    audio: true,
  };
  const stream = await navigator.mediaDevices.getUserMedia(constraints);
  return stream;
}

function addTrackToLocalStream() {
  getMedia().then((stream) => {
    stream.getTracks().forEach((track) => {
      if (track.kind === "audio") return;
      localStream.addTrack(track);
    });
  });
}

export function addTrackToRemoteStream(track) {
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
  if (rtc?.signalingState !== "stable") {
    return;
  }
  rtc.addIceCandidate(res.candidate);
}

function handleOffer(res) {
  if (rtc?.signalingState !== "stable") {
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
