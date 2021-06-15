import { useEffect, useRef, useState } from "react";
import "./App.css";
import Peer from "peerjs";
import _ from "lodash";

function App() {
  let [conns, setConns] = useState([]);
  let [incomingStreams, setIncomingStreams] = useState([]);
  let [videoRefs, setVideoRefs] = useState([]);
  let [peerServerConnection, setPeerServerConnection] = useState(false);

  function broadCastMessage() {
    conns.forEach((c) => {
      c.send("hello");
    });
  }

  useEffect(() => {
    let peer = new Peer("parent", {
      host: process.env.REACT_APP_PEER_SERVER,
      port: process.env.REACT_APP_PEER_SERVER_PORT,
      debug: 2,
      path: "/peerjs/myapp",
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      sdpSemantics: "unified-plan",
    });

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
        call.answer();
        call.on("stream", (stream) => {
          console.log("a call stream has come in");
          setIncomingStreams([..._.cloneDeep(incomingStreams), stream]);
        });
      });
    });

    peer.on("disconnected", () => {
      setPeerServerConnection(false);
    });

    return function cleanup() {
      peer.disconnect();
    };
  }, []);

  useEffect(() => {}, [incomingStreams]);

  return (
    <div className="App">
      Connection to server is {peerServerConnection ? "up" : "down"} <br />
      Peers: {conns.length}
      <br />
      {conns.map((c, i) => (
        <button
          onClick={() => {
            c.send("Hola");
          }}
        >
          Connection {i}
        </button>
      ))}
      <br />
      <button onClick={broadCastMessage}>test</button>
      <br />
      {incomingStreams.map((s, i) => {
        return <IncomingVideo key={`video_${i}`} stream={s} />;
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
  }, [ref]);
  return (
    <>
      hi
      <video ref={ref} autoPlay={true} />
    </>
  );
}

export default App;
