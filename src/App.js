import { useEffect, useRef, useState } from "react";
import Peer from "peerjs";
import AppFrame from "./components/app-frame";
import StatusBar from "./components/status-bar";
import VideoFrame from "./components/video-frame";
import TabBar from "./components/tab-bar";
import PeerList from "./components/peers";
import { People } from "react-ikonate";

import styled from "styled-components";

import { createMachine, assign } from "xstate";
import { useMachine } from "@xstate/react";

function App() {
  let peer;

  let argosParentMachine = createMachine({
    id: "ArgosParent",
    initial: "start",
    context: { room_name: null, children: [] },
    states: {
      start: {},
      create_room: {
        initial: "check_room_name_availability",
        actions: assign({
          room_name: () => {
            return "cow";
          },
        }),
        states: {
          check_room_name_availability: {
            invoke: {
              id: "check-room-name-availability",
              src: (context) => {
                return new Promise((resolve, reject) => {
                  window.setTimeout(() => {
                    resolve({ a: "hello" });
                  }, 2000);
                });
              },

              onDone: {
                target: "create_room_with_available_name",
                actions: assign({
                  room_name: (context, event) => event.name,
                }),
              },
            },
            on: {},
          },
          create_room_with_available_name: {},
        },
      },
    },
    on: {
      CREATE_ROOM: {
        target: ".create_room",
        // actions: assign({ room_name: (context, event) => event.name }),
      },
    },
  });

  let [state, send] = useMachine(argosParentMachine);

  return (
    <div className="App">
      <AppFrame>
        <StatusBar room={state.context.room_name} />

        <Screen state={state.value} context={state.context} />
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
