import { useEffect, useRef, useState } from "react";
import "./App.css";
import Peer from "peerjs";

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
      host: "192.168.86.204",
      port: "9000",
      debug: 2,
      path: "/peerjs/myapp",
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
          setIncomingStreams([...incomingStreams, stream]);
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
