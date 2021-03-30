import React from "react";
import io from "socket.io-client";
import Victor from "victor";
import Q5 from "../assets/q5.js";
import Bubble from "../Bubble.js";
class BubbleWorld extends React.Component {
  componentDidMount() {
    this.socket = io(process.env.REACT_APP_SOCKET_HOST, { transports: ["websocket"], query: { clientType: "world" } });

    this.socket.on("send to world", (bubble) => {
      console.log("World received bubble yeahh", bubble);
    });

    const canvasWrapper = document.getElementById('canvas-wrapper');
    console.log("🚀 ~ file: BubbleWorld.js ~ line 15 ~ BubbleWorld ~ componentDidMount ~ canvas", canvasWrapper)
    
    let q5 = new Q5(canvasWrapper);
    q5.createCanvas(1000, 1000);
    q5.noStroke()
  

    const bubble = new Bubble(new Victor(500,500), true, new Victor(500,500));
    q5.draw = () => {
      if(q5.keyIsDown(q5.UP_ARROW)){
        bubble.applyForce(new Victor(0,-2))
      }
      q5.background(80);
      q5.ellipse(bubble.pos.x,bubble.pos.y,150,150)
    }

    
    
    

  

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
        <div id="canvas-wrapper"></div>
      </div>
    );
  }
}

export default BubbleWorld;
