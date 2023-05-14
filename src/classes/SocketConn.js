class SocketConn {
  events = {};
  constructor(url) {
    this.conn = new WebSocket(url);
    this.conn.onmessage = this.executeCallbacks;
  }

  on(event, callback) {
    this.events[event] = callback;
  }

  executeCallbacks({ data }) {
    const message = JSON.parse(data);
    const fn = this.events[message];
    if (fn) {
      fn(message);
    }
  }
  send(data) {
    this.conn.send(JSON.stringify(data));
  }
}
