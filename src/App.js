import { useEffect, useRef, useState } from "react";
import Peer from "peerjs";
import AppFrame from "./components/app-frame";
import StatusBar from "./components/status-bar";
import VideoFrame from "./components/video-frame";
import TabBar from "./components/tab-bar";
import PeerList from "./components/peers";
import { People } from "react-ikonate";
import styled from "styled-components";

import _ from "lodash";

import { useMachine } from "@xstate/react";
import argosParentMachine from "./argos-parent-machine.js";
import { inspect } from "@xstate/inspect";

inspect({
  // options
  // url: 'https://statecharts.io/inspect', // (default)
  iframe: false, // open in new window
});

// const Button = styled.div`

// background: red;

// :hover{
//   cursor: pointer;
// }

// `

function App() {
  let peer;

  let [state, send] = useMachine(argosParentMachine, {
    devTools:
      process.env.NODE_ENV === "development" && typeof window !== "undefined",
  });

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

        {state.value === "create_room" ? (
          <>
            <button
              onClick={() => {
                send("SUCCESS", { name: "room name" });
              }}
            >
              Success
            </button>

            <button
              onClick={() => {
                send("FAILURE");
              }}
            >
              Failure
            </button>
          </>
        ) : (
          <></>
        )}

        {state.value === "failure_alert" ? (
          <>
            <p>Failure to create room. Please try again.</p>
          </>
        ) : (
          <></>
        )}

        {state.value === "assigned_room_name" ? (
          <>
            <input
              type="text"
              onChange={(e) => setPw(e.target.value)}
              value={pw}
              room={pw}
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
