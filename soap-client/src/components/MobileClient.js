import React from "react";
import io from "socket.io-client";
import Victor from "victor";
import Q5 from "../assets/q5.js";
import Bubble from "../Bubble.js";

class MobileClient extends React.Component {
  constructor(props) {
    super(props);
    this.bubbleCount = 0;
    this.bubble = null;
  }

  componentDidMount() {

    this.socket = io(process.env.REACT_APP_SOCKET_HOST, { transports: ["websocket"], query: { clientType: "mobile" } });
    this.socket.on("connect", () => {
      this.bubble = this.createBubble(this.socket.id);
      console.log("🚀 ~ file: MobileClient.js ~ line 17 ~ MobileClient ~ socket.on ~ this.currentBubble", this.bubble);
      this.sendBubbleToWorld();

      // Canvas Initialization
      const canvasWrapper = document.getElementById("canvas-wrapper");
      let q5 = new Q5(canvasWrapper);
      q5.createCanvas(window.innerWidth, window.innerHeight);
      q5.noStroke();

      //Resize Listener
      window.addEventListener("resize", () => {
        q5.resizeCanvas(window.innerWidth, window.innerHeight);
      });

      q5.draw = () => {
        if (q5.keyIsDown(q5.UP_ARROW)) {
          this.bubble.applyForce(new Victor(0, -2));
        }
        let backgroundColor = q5.color(57, 66, 97);
        q5.background(backgroundColor);
        this.bubble.draw(q5);
        // this.bubble.pos.y
        // console.log("🚀 ~ file: MobileClient.js ~ line 42 ~ MobileClient ~ this.socket.on ~ this.bubble.pos.y", this.bubble.pos.y)
      };
      this.getLocalStream();
    });
  }

  getLocalStream() {
    const self = this;
    navigator.mediaDevices
      .getUserMedia({ video: false, audio: true })
      .then((stream) => {
        console.log(
          "🚀 ~ file: MobileClient.js ~ line 132 ~ MobileClient ~ navigator.mediaDevices.getUserMedia ~ window",
          window
        );
        window.localStream = stream;

        var AudioContext = window.AudioContext || window.webkitAudioContext;
        var context = new AudioContext();

        var analyser = context.createAnalyser();
        analyser.smoothingTimeConstant = 0.2;
        analyser.fftSize = 1024;

        var node = context.createScriptProcessor(2048, 1, 1);

        var values = 0;
        var average;
        node.onaudioprocess = function () {
          // bitcount is fftsize / 2
          var array = new Uint8Array(analyser.frequencyBinCount);
          analyser.getByteFrequencyData(array);

          var length = array.length;
          for (var i = 0; i < length; i++) {
            values += array[i];
          }

          average = values / length;
          if(average > 25){
            self.bubble.applyForce({x: 0, y: average * -0.02})
          }
          average = values = 0;
        };

        var input = context.createMediaStreamSource(stream);

        input.connect(analyser);
        analyser.connect(node);
        node.connect(context.destination);
      })
      .catch((err) => {
        console.log("u got an error:" + err);
      });
  }

  createBubble(socketID) {
    this.bubbleCount++;
    const bubbleID = socketID + "_" + this.bubbleCount;
    return new Bubble(bubbleID, { x: window.innerWidth / 2, y: window.innerHeight / 2 }, true, {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    });

    // return {
    //   id: bubbleID,
    //   velocity: { x: 0, y: 1 },
    //   imagePath: "",
    // };
  }

  sendBubbleToWorld() {
    // Error Handling
    if (!this.bubble) {
      console.log("Error: No bubble exists that can be sent!");
      return;
    }
    // Emit Message
    this.socket.emit("send to world", this.bubble);
  }

  render() {
    return (
      <div className="mobile-client">
        <div id="canvas-wrapper"></div>
      </div>
    );
  }
}

export default MobileClient;
