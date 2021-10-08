import { useState } from "react";
import AppFrame from "./components/app-frame";
import StatusBar from "./components/status-bar";

import StartScreen from "./pages/start-screen";
import RoomStartScreen from "./pages/room-start-screen";
import ErrorScreen from "./pages/error-screen";
import FetchedRoom from "./pages/create-room-screen";
import StreamRoom from "./pages/stream-room";
import EnterPassword from "./pages/enter-password";
import RoomJoined from "./pages/room-joined";

import _ from "lodash";

import { useMachine } from "@xstate/react";
import argosParentMachine from "./argos-parent-machine.js";
import { inspect } from "@xstate/inspect";

// inspect({ iframe: false });

function App() {
  let [state, send] = useMachine(argosParentMachine, {
    devTools:
      process.env.NODE_ENV === "development" && typeof window !== "undefined",
  });

  let [supported, setSupported] = useState(
    (() => {
      let _ac = new AudioContext();
      let msts = _ac.createMediaStreamTrackSource;
      _ac = null;
      return typeof msts === "function";
    })()
  );

  return (
    <div className="App">
      <AppFrame>
        <StatusBar room={_.get(state, "context.room.name")} version="0.2.0" />

        {supported ? (
          <Screen state={state.value} context={state.context} send={send} />
        ) : (
          <div style={{ textAlign: "center", padding: "2em" }}>
            <h1>Browser not supported.</h1>
            <p>
              Please access this application using the latest version of
              Firefox.
            </p>
          </div>
        )}
      </AppFrame>
    </div>
  );
}

export default App;

function Screen({ context, state, send }) {
  switch (state) {
    case "start":
      return <StartScreen send={send} />;

    case "server_connected":
      return <RoomStartScreen send={send} context={context} />;

    case "error":
      return <ErrorScreen send={send} context={context} />;

    case "create_room":
      return <FetchedRoom send={send} context={context} />;

    case "stream_room":
      return (
        <StreamRoom
          send={send}
          context={context}
          error={_.get(state, "context.error.message")}
          parents={[
            { id: "Parent 1", status: "host" },
            { id: "Parent 2", status: "backup" },
          ]}
        />
      );

    case "enter_password":
      return <EnterPassword send={send} context={context} />;

    case "room_joined":
      return <RoomJoined send={send} context={context} />;

    default:
      return <></>;
  }
}
