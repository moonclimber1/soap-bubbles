import React from "react";
import io from "socket.io-client";

class MobileClient extends React.Component {
  componentDidMount() {
    const socket = io('http://localhost:7777/', {query: {clientType: 'mobile'}});
  }

  render() {
    return <h1>Hello, I'm a mobile client</h1>;
  }
}

export default MobileClient;
