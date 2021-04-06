import React from "react";
import io from "socket.io-client";
import Stats from 'stats.js'
import Q5 from "../assets/q5.js";
import Bubble from "../common/Bubble.js";
import ImageLibrary from "../common/ImageLibrary.js";
class BubbleWorld extends React.Component {
  constructor(props) {
    super(props);
    this.bubbles = [];
    this.imageLibrary = new ImageLibrary();
  }

  componentDidMount() {
    this.socket = io(process.env.REACT_APP_SOCKET_HOST, { transports: ["websocket"], query: { clientType: "world" } });

    this.socket.on("send to world", (bubbleData) => {
      console.log("World received bubble yeahh", bubbleData);
      const bubble = Bubble.createFromBubble(bubbleData);
      bubble.imageLibrary = this.imageLibrary;
      bubble.pos.x = Math.random() * window.innerWidth;
      bubble.pos.y = window.innerHeight+100;
      bubble.setPullPoint( { x: window.innerWidth * (0.1 + Math.random() * 0.8), y: window.innerHeight * (0.1 + Math.random() * 0.8)});
      console.log("🚀 ~ file: BubbleWorld.js ~ line 18 ~ BubbleWorld ~ this.socket.on ~ bubble", bubble);

      this.bubbles.push(bubble);
      console.log(
        "🚀 ~ file: BubbleWorld.js ~ line 21 ~ BubbleWorld ~ this.socket.on ~ this.bubbles.length",
        this.bubbles.length
      );
    });

    this.socket.on("blow", (blowInfo) => {
      const bubble = this.bubbles.find((bubble) => bubble.id === blowInfo.id);
      if (bubble) {
        bubble.applyForce(blowInfo.blowForce);
      }
    });

    this.socket.on('transfer image', (imgInfo) => {
      const img = new Image()
      img.src = imgInfo.dataURL;
      this.imageLibrary.addImage(imgInfo.id, img)
    });

    

    var stats = new Stats();
    stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild( stats.dom );


    const canvasWrapper = document.getElementById("world-canvas-wrapper");
    // console.log("🚀 ~ file: BubbleWorld.js ~ line 15 ~ BubbleWorld ~ componentDidMount ~ canvas", canvasWrapper)

    let q5 = new Q5(canvasWrapper);
    q5.createCanvas(window.innerWidth, window.innerHeight);

    q5.draw = () => {
      stats.begin();
      let backgroundColor = q5.color(24, 33, 44);
      q5.background(backgroundColor);
      // const xLen = window.innerWidth / this.bubbles.length
      this.bubbles.forEach((bubble, index) => {
        
        bubble.applyForce({x: (q5.noise(bubble.frame/600 + index)-0.5)*0.02, y: (q5.noise(bubble.frame/600 + index)-0.5)*0.02});
        bubble.draw(q5);
      });
      stats.end();
    };

    // console.log("🚀 ~ file: BubbleWorld.js ~ line 18 ~ BubbleWorld ~ componentDidMount ~ q5", q5)
    // Q5();
    // console.log("🚀 ~ Q5", Q5)

    // const script = document.createElement("script");
    // script.src = "https://cdn.jsdelivr.net/gh/LingDong-/q5xjs/q5.min.js";
    // script.id = 'q5'

    // // // script.async = true;

    // document.body.appendChild(script);
    // script.onload( () => {
    //     let q5 = new Q5();
    // })
  }

  render() {
    return (
      <div className="bubble-world">
        <div id="world-canvas-wrapper"></div>
      </div>
    );
  }
}

export default BubbleWorld;
