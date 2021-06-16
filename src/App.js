import { useEffect, useRef, useState } from "react";
import "./App.css";
import Peer from "peerjs";
import _ from "lodash";

function App() {
  let [conns, setConns] = useState([]);
  let [incomingStreams, setIncomingStreams] = useState([]);
  let [newStream, setNewStream] = useState(null);
  let [peerServerConnection, setPeerServerConnection] = useState(false);

  let [aState, setAState] = useState([]);
  let peer;

  function broadCastMessage() {
    conns.forEach((c) => {
      c.send("hello");
    });
  }

  useEffect(() => {
    console.log(incomingStreams);
    console.log(newStream);

    setIncomingStreams([...incomingStreams, newStream]);
  }, [newStream]);

  useEffect(() => {
    peer = new Peer("parent", {
      host: process.env.REACT_APP_PEER_SERVER,
      port: process.env.REACT_APP_PEER_SERVER_PORT,
      debug: 2,
      path: "/peerjs/myapp",
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      sdpSemantics: "unified-plan",
    });

    return function cleanup() {
      peer.disconnect();
    };
  }, []);

  useEffect(() => {
    peer.on("open", function () {
      setPeerServerConnection(true);

      peer.on("connection", (connection) => {
        console.log("connection received");
        setConns([...conns, connection]);

        connection.on("data", (data) => {
          console.log("received data " + data);
        });

        connection.on("open", () => {
          console.log("connection opened");
        });
      });

      peer.on("call", (call) => {
        console.log(call);
        call.answer();
        call.on("stream", (stream) => {
          console.log("a call stream has come in", stream);
          setNewStream(stream);
        });
      });
    });

    peer.on("disconnected", () => {
      setPeerServerConnection(false);
    });
  }, [peer]);

  return (
    <div className="App">
      Connection to server is {peerServerConnection ? "up" : "down"} <br />
      {/* {JSON.stringify(aState)} */}
      Peers: {conns.length}
      Streams: {Object.keys(incomingStreams).length}
      <br />
      {conns.map((c, i) => (
        <button
          key={i}
          onClick={() => {
            c.send("Hola");
          }}
        >
          Connection {i}
        </button>
      ))}
      <br />
      {/* <button onClick={broadCastMessage}>test</button> */}
      <br />
      {Object.keys(incomingStreams).map((s, i) => {
        return <IncomingVideo key={`video_${i}`} stream={incomingStreams[s]} />;
      })}
    </div>
  );
}

function IncomingVideo({ stream }) {
  let ref = useRef();
  useEffect(() => {
    if (ref.current) {
      ref.current.srcObject = stream;
      ref.current.play();
    }
  }, [ref, stream]);
  return (
    <div>
      <video ref={ref} autoPlay={true} width="400" />
    </div>
  );
}

export default App;
