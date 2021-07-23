import { useEffect, useRef, useState } from "react";
import Peer from "peerjs";
import AppFrame from "./components/app-frame";
import StatusBar from "./components/status-bar";
import VideoFrame from "./components/video-frame";
import TabBar from "./components/tab-bar";
import PeerList from "./components/peers";
import { People } from "react-ikonate";

import _ from "lodash";

import { useMachine } from "@xstate/react";
import argosParentMachine from "./argos-parent-machine.js";

function App() {
  let peer;

  let [state, send] = useMachine(argosParentMachine, { devTools: true });
  let [pw, setPw] = useState("");

  return (
    <div className="App">
      <AppFrame>
        <StatusBar room={_.get(state, "context.room.name")} />

        <Screen state={state.value} context={state.context} />

        {state.value === "start" ? (
          <button
            onClick={() => {
              send("CREATE_ROOM");
            }}
          >
            Create Room
          </button>
        ) : (
          <></>
        )}
        {state.value.create_room === "set_password" ? (
          <>
            <input
              type="text"
              onChange={(e) => setPw(e.target.value)}
              value={pw}
            />
            <button
              onClick={() => {
                send("SET_PASSWORD", { password: pw });
              }}
            >
              Create Room
            </button>
          </>
        ) : (
          <></>
        )}
        <button
          onClick={() => {
            send("RESET");
          }}
        >
          send reset
        </button>
      </AppFrame>
    </div>
  );

  // function broadCastMessage() {
  //   conns.forEach((c) => {
  //     c.send("hello");
  //   });
  // }

  // function listPeers() {}

  // useEffect(() => {
  //   setIncomingStreams([...incomingStreams, newStream]);
  // }, [newStream]);

  // useEffect(() => {
  //   peer = new Peer("parent", {
  //     host: process.env.REACT_APP_PEER_SERVER,
  //     port: process.env.REACT_APP_PEER_SERVER_PORT,
  //     debug: 2,
  //     key: "tiger",
  //     path: "/peerjs/myapp",
  //     config: {
  //       iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  //       sdpSemantics: "unified-plan",
  //     },
  //   });

  //   return function cleanup() {
  //     peer.disconnect();
  //   };
  // }, []);

  // useEffect(() => {
  //   peer.on("open", function () {
  //     setPeerServerConnection(true);

  //     peer.on("connection", (connection) => {
  //       console.log("connection received");
  //       setConns([...conns, connection]);

  //       connection.on("data", (data) => {
  //         console.log("received data " + data);
  //       });

  //       connection.on("open", () => {
  //         console.log("connection opened");
  //       });
  //     });

  //     peer.on("call", (call) => {
  //       console.log(call);
  //       call.answer();
  //       call.on("stream", (stream) => {
  //         console.log("a call stream has come in", stream);
  //         setNewStream(stream);
  //       });
  //     });
  //   });

  //   peer.on("disconnected", () => {
  //     setPeerServerConnection(false);
  //   });
  // }, [peer]);
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

function Screen() {
  return <div></div>;
}
