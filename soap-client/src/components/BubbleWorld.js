import React from "react";
import io from "socket.io-client";
import Victor from "victor";
import Q5 from "../assets/q5.js";
import Bubble from "../Bubble.js";
class BubbleWorld extends React.Component {
  constructor(props) {
    super(props);
    this.bubbles = [];
  }

  componentDidMount() {
    this.socket = io(process.env.REACT_APP_SOCKET_HOST, { transports: ["websocket"], query: { clientType: "world" } });

    this.socket.on("send to world", (bubbleData) => {
      console.log("World received bubble yeahh", bubbleData);
      const bubble = Bubble.createFromBubble(bubbleData);
      bubble.pos.x = Math.random() * window.innerWidth;
      bubble.pos.y = window.innerHeight;
      bubble.setPullPoint( { x: window.innerWidth / 2, y: (3 * window.innerHeight) / 4});
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

    const canvasWrapper = document.getElementById("world-canvas-wrapper");
    // console.log("🚀 ~ file: BubbleWorld.js ~ line 15 ~ BubbleWorld ~ componentDidMount ~ canvas", canvasWrapper)

    let q5 = new Q5(canvasWrapper);
    q5.createCanvas(window.innerWidth, window.innerHeight);

    q5.draw = () => {
      let backgroundColor = q5.color(24, 33, 44);
      q5.background(backgroundColor);
      // const xLen = window.innerWidth / this.bubbles.length
      this.bubbles.forEach((bubble, index) => {
        bubble.draw(q5);
        // const color = bubble.color;
        // q5.fill(q5.color(color._r,color._g,color._b))
        // q5.ellipse(xLen * index + 50,bubble.pos.y,100,100)
      });
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
