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

    this.socket.on("send to world", (bubble) => {
      console.log("World received bubble yeahh", bubble);
      this.bubbles.push(bubble);
      console.log(
        "🚀 ~ file: BubbleWorld.js ~ line 21 ~ BubbleWorld ~ this.socket.on ~ this.bubbles.length",
        this.bubbles.length
      );
    });

    this.socket.on("blow", (blowInfo) => {
      const bubble = this.bubbles.find((bubble) => bubble.id === blowInfo.id);
      if (bubble) {
        console.log("🚀 ~ file: BubbleWorld.js ~ line 25 ~ BubbleWorld ~ this.socket.on ~ bubble", bubble)
        // bubble.applyForce(blowInfo.blowForce);
      }
    });

    const canvasWrapper = document.getElementById("world-canvas-wrapper");
    // console.log("🚀 ~ file: BubbleWorld.js ~ line 15 ~ BubbleWorld ~ componentDidMount ~ canvas", canvasWrapper)

    let q5 = new Q5(canvasWrapper);
    q5.createCanvas(window.innerWidth, window.innerHeight);

    q5.draw = () => {
      q5.background(80);
      const xLen = window.innerWidth / this.bubbles.length
      this.bubbles.forEach((bubble, index) => {
        const c = bubble.color;
        q5.fill(q5.color(c.r,c.g,c.b))
        // q5.fill(q5.color(30,100,10))
        // noStroke()
        q5.ellipse(xLen * index + 50,window.innerHeight/2,50,50)
      })

      
      // q5.ellipse(bubble.pos.x,bubble.pos.y,150,150)
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
        <h1>Hello, I'm the bubble world</h1>
        <div id="world-canvas-wrapper"></div>
      </div>
    );
  }
}

export default BubbleWorld;
