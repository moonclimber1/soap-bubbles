import React from "react";
import io from "socket.io-client";

class MobileClient extends React.Component {
  constructor(props) {
    super(props);
    this.bubbleCount = 0;
    this.currentBubble = null;
  }

  componentDidMount() {
    this.socket = io(process.env.REACT_APP_SOCKET_HOST, { transports: ["websocket"], query: { clientType: "mobile" } });

    this.socket.on("connect", () => {
      this.currentBubble = this.createBubble(this.socket.id);
      console.log("🚀 ~ file: MobileClient.js ~ line 17 ~ MobileClient ~ socket.on ~ this.currentBubble", this.currentBubble);
      this.sendBubbleToWorld();
    });

    /**
     * Create global accessible variables that will be modified later
     */
    var audioContext = null;
    var meter = null;
    var rafID = null;
    var mediaStreamSource = null;

    // Retrieve AudioContext with all the prefixes of the browsers
    window.AudioContext = window.AudioContext || window.webkitAudioContext;

    // Get an audio context
    audioContext = new AudioContext();

    /**
     * Callback triggered if the microphone permission is denied
     */
    function onMicrophoneDenied() {
      alert("Stream generation failed.");
    }

    /**
     * Callback triggered if the access to the microphone is granted
     */
    function onMicrophoneGranted(stream) {
      // Create an AudioNode from the stream.
      mediaStreamSource = audioContext.createMediaStreamSource(stream);
      // Create a new volume meter and connect it.
      meter = createAudioMeter(audioContext);
      mediaStreamSource.connect(meter);

      // Trigger callback that shows the level of the "Volume Meter"
      onLevelChange();
    }

    /**
     * This function is executed repeatedly
     */
    function onLevelChange(time) {
      // check if we're currently clipping

      if (meter.checkClipping()) {
        console.warn(meter.volume);
      } else {
        console.log(meter.volume);
      }

      // set up the next callback
      rafID = window.requestAnimationFrame(onLevelChange);
    }

    // Try to get access to the microphone
    try {
      // Retrieve getUserMedia API with all the prefixes of the browsers
      navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

      // Ask for an audio input
      navigator.getUserMedia(
        {
          audio: {
            mandatory: {
              googEchoCancellation: "false",
              googAutoGainControl: "false",
              googNoiseSuppression: "false",
              googHighpassFilter: "false",
            },
            optional: [],
          },
        },
        onMicrophoneGranted,
        onMicrophoneDenied
      );
    } catch (e) {
      alert("getUserMedia threw exception :" + e);
    }
  }

  createBubble(socketID) {
    this.bubbleCount++;
    const bubbleID = socketID + "_" + this.bubbleCount;
    return {
      id: bubbleID,
      velocity: { x: 0, y: 1 },
      imagePath: "",
    };
  }

  sendBubbleToWorld() {
    // Error Handling
    if (!this.currentBubble) {
      console.log("Error: No bubble exists that can be sent!");
      return;
    }
    // Emit Message
    this.socket.emit("send to world", this.currentBubble);
  }

  render() {
    return <h1>Hello, I'm a mobile client</h1>;
  }
}

export default MobileClient;
