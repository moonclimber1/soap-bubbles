import React from 'react';
import io from "socket.io-client";
import Q5 from "q5xjs/q5";

class BubbleWorld extends React.Component {
    componentDidMount() {
        this.socket = io(process.env.REACT_APP_SOCKET_HOST, {transports: ["websocket"], query: {clientType: 'world'}});

        this.socket.on('send to world', bubble => {
            console.log("World received bubble yeahh", bubble)
        })

        // let q5 = new Q5();
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