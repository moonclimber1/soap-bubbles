import React from "react";
import ImageUploadButton from './ImageUploadButton'
import io from "socket.io-client";
import Q5 from "../assets/q5.js";
import Bubble from "../common/Bubble.js";

import img from '../assets/soap-bubble.jpg';
import ImageLibrary from "../common/ImageLibrary";

class MobileClient extends React.Component {
  constructor(props) {
    super(props);
    this.bubbleCount = 0;
    this.bubble = null;
    this.bubbleIsHere = true;
    this.imageLibrary = new ImageLibrary();
  }

  componentDidMount() {
    this.socket = io(process.env.REACT_APP_SOCKET_HOST, { transports: ["websocket"], query: { clientType: "mobile" } });
    this.socket.on("connect", () => {
      this.bubble = this.createBubble(this.socket.id);
      console.log("🚀 ~ file: MobileClient.js ~ line 17 ~ MobileClient ~ socket.on ~ this.currentBubble", this.bubble);

      // Canvas Initialization
      const canvasWrapper = document.getElementById("canvas-wrapper");
      let q5 = new Q5(canvasWrapper);
      q5.createCanvas(window.innerWidth, window.innerHeight);

      //Resize Listener
      window.addEventListener("resize", () => {
        q5.resizeCanvas(window.innerWidth, window.innerHeight);
      });

      q5.draw = () => {
        if (q5.keyIsDown(q5.UP_ARROW)) {
          this.blow({ x: 0, y: -2 });
        }
      
        if(!this.bubbleIsHere) return;
        
        let backgroundColor = q5.color(24, 33, 44);
        q5.background(backgroundColor);

        

        this.bubble.draw(q5);
        if (this.bubble.isAboveTop()) {
          console.log("🚀 ~ Sending Bubble", this.bubble)
          this.sendBubbleToWorld();
          this.bubbleIsHere = false;
        }
      };
      this.getLocalStream();
    });
  }

  getLocalStream() {
    const self = this;
    navigator.mediaDevices
      .getUserMedia({ video: false, audio: true })
      .then((stream) => {
        window.localStream = stream;

        var AudioContext = window.AudioContext || window.webkitAudioContext;
        var context = new AudioContext();

        var analyser = context.createAnalyser();
        analyser.smoothingTimeConstant = 0.2;
        analyser.fftSize = 1024;

        var node = context.createScriptProcessor(2048, 1, 1); //FIXME: Deprecated Function

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
          if (average > 20) {
            self.blow({ x: 0, y: average * average * -0.0005 })
            // console.log("blow");
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
    return new Bubble(
      bubbleID,
      {
        x: window.innerWidth / 2,
        y: (3 * window.innerHeight) / 4,
      },
      true,
      {
        x: window.innerWidth / 2,
        y: (3 * window.innerHeight) / 4,
      },
      this.imageLibrary
    );
  }

  sendBubbleToWorld() {
    // Error Handling
    if (!this.bubble) {
      console.log("Error: No bubble exists that can be sent!");
      return;
    }
    // Emit Message
    delete this.bubble.imageLibrary
    this.socket.emit("send to world", this.bubble);
  }

  blow(blowForce){
    if (!this.bubble) {
      console.log("Error: No bubble exists to be blown!");
      return;
    }
    if(this.bubbleIsHere){
      this.bubble.applyForce(blowForce);
    }else{
      // Emit Message
       this.socket.emit("blow", {id: this.bubble.id, blowForce: blowForce});
    }
  }

  handleImageSelect(imgDataURL){
    // console.log("Image selected", imgDataURL)

    const img = new Image()
    img.src = imgDataURL;
    this.imageLibrary.addImage(this.bubble.id, img)

    this.socket.emit('transfer image', {id: this.bubble.id, dataURL: imgDataURL})
  }

  render() {
    return (
      <div className="mobile-client">
        <div id="canvas-wrapper"></div>
        <ImageUploadButton onImageSelect={ img => this.handleImageSelect(img) }/>
      </div>
    );
  }
}

export default MobileClient;
