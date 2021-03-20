import React from 'react';
import io from "socket.io-client";
// import Q5 from "q5xjs/q5";
// import "data:text/javascript,self.module = {}";
// import "https://cdn.jsdelivr.net/gh/reworkcss/css@latest/lib/parse/index.js";

import Q5 from '../assets/q5.js';

class BubbleWorld extends React.Component {
    componentDidMount() {
        this.socket = io(process.env.REACT_APP_SOCKET_HOST, {transports: ["websocket"], query: {clientType: 'world'}});

        this.socket.on('send to world', bubble => {
            console.log("World received bubble yeahh", bubble)
        })

        let q5 = new Q5();
        console.log("🚀 ~ file: BubbleWorld.js ~ line 18 ~ BubbleWorld ~ componentDidMount ~ q5", q5)
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
      return <h1>Hello, I'm the bubble world</h1>;
    }
}

export default BubbleWorld;