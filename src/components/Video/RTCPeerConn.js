const url = "ws://localhost:3000";

const iceServers = [
  {
    urls: "stun:stun.12connect.com:3478",
  },
  {
    urls: "stun:stun.2talk.co.nz:3478",
  },
];
const constraints = {
  audio: false,
  video: {
    width: { ideal: 1920 },
    height: { ideal: 1080 },
  },
};

export const localStream = new MediaStream();
export const remoteStream = new MediaStream();
const conn = new WebSocket(url);
const rtc = new RTCPeerConnection({
  iceServers,
});

getMedia().then((tracks) => {
  tracks.forEach((track) => localStream.addTrack(track));
});

const funcObject = {
  "user joined": (res) => addTrackToPeerConn(),
  offer: handleOffer,
  answer: setRemoteDesc,
  candidate: handleIceCandidate,
};

rtc.onicecandidate = (event) => {
  if (event.candidate) {
    conn.send(
      JSON.stringify({ type: "candidate", candidate: event.candidate })
    );
  }
};

rtc.ontrack = ({ track }) => {
  remoteStream.addTrack(track);
};

rtc.onnegotiationneeded = () => {
  createOffer();
};

conn.onopen = () => {
  conn.send(JSON.stringify({ type: "id", id: "123" }));
};

conn.onmessage = handleMessage;

async function getMedia() {
  const stream = await navigator.mediaDevices.getUserMedia(constraints);
  return stream.getTracks();
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
  getMedia().then((tracks) => {
    tracks.forEach((track) => {
      rtc.addTrack(track);
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
