import React from "react";
import io from "socket.io-client";

class MobileClient extends React.Component {
  constructor(props) {
    super(props);
    this.bubbleCount = 0;
    this.currentBubble = null;
  }

  componentDidMount() {
    this.socket = io(process.env.REACT_APP_SOCKET_HOST, { transports: ["websocket"], query: { clientType: "mobile" } });

    this.socket.on("connect", () => {
      this.currentBubble = this.createBubble(this.socket.id);
      console.log("🚀 ~ file: MobileClient.js ~ line 17 ~ MobileClient ~ socket.on ~ this.currentBubble", this.currentBubble);
      this.sendBubbleToWorld();
    });
  }

  createBubble(socketID) {
    this.bubbleCount++;
    const bubbleID = socketID + "_" + this.bubbleCount;
    return {
      id: bubbleID,
      velocity: { x: 0, y: 1 },
      imagePath: "",
    };
  }

  sendBubbleToWorld() {
    // Error Handling
    if (!this.currentBubble) {
      console.log("Error: No bubble exists that can be sent!");
      return;
    }
    // Emit Message
    this.socket.emit('send to world', this.currentBubble);
  }

  render() {
    return <h1>Hello, I'm a mobile client</h1>;
  }
}

export default MobileClient;
