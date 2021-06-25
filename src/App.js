import { useEffect, useRef, useState } from "react";
import "./App.css";
import Peer from "peerjs";
import _ from "lodash";
import VideoFrame from "./components/video-frame";
import TabBar from "./components/tab-bar";
import PeerList from "./components/peers";
import { People } from "react-ikonate";

function App() {
  let [conns, setConns] = useState([]);
  let [incomingStreams, setIncomingStreams] = useState([]);
  let [newStream, setNewStream] = useState(null);
  let [peerServerConnection, setPeerServerConnection] = useState(false);

  let peer;

  function broadCastMessage() {
    conns.forEach((c) => {
      c.send("hello");
    });
  }

  function listPeers() {}

  useEffect(() => {
    setIncomingStreams([...incomingStreams, newStream]);
  }, [newStream]);

  useEffect(() => {
    peer = new Peer("parent", {
      host: process.env.REACT_APP_PEER_SERVER,
      port: process.env.REACT_APP_PEER_SERVER_PORT,
      debug: 2,
      key: "tiger",
      path: "/peerjs/myapp",
      config: {
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
        sdpSemantics: "unified-plan",
      },
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
      {/* Brian insert tab bar here */}
      <TabBar
        tabs={[
          { subtitle: "Streams", selected: "true" },
          { subtitle: "Monitor", selected: "" },
          { subtitle: "Out", selected: "" },
          { subtitle: "Tab 4", selected: "" },
        ]}
      />
      <PeerList
        peers={[
          { role: "parent", id: "parent1", connection_quality: 3 },
          { role: "parent", id: "parent2", connection_quality: 5 },
          { role: "children", id: "child1", connection_quality: 2 },
          { role: "children", id: "child2", connection_quality: 1 },
          { role: "children", id: "child3", connection_quality: 5 },
        ]}
      />
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
