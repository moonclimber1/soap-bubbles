import React from 'react';
import io from "socket.io-client";

class BubbleWorld extends React.Component {
    componentDidMount() {
        const socket = io('http://localhost:7777/', {query: {clientType: 'world'}});
    }

    render() {
      return <h1>Hello, I'm the bubble world</h1>;
    }
}

export default BubbleWorld;