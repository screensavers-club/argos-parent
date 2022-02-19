import { useState } from "react";
import AppFrame from "./components/app-frame";
import StatusBar from "./components/status-bar";

import StartScreen from "./screens/start-screen";
import RoomStartScreen from "./screens/room-start-screen";
import ErrorScreen from "./screens/error-screen";
import FetchedRoom from "./screens/create-room-screen";
import RoomWorkspace from "./screens/room-workspace";
import EnterPassword from "./screens/enter-password";

import _ from "lodash";

import { useMachine } from "@xstate/react";
import argosParentMachine from "./argos-parent-machine.js";
import { inspect } from "@xstate/inspect";

import { colors } from "./util/fruit-colors";

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
      let _supported = typeof msts === "function";
      _ac = null;
      return _supported;
    })()
  );

  return (
    <div className="App">
      <AppFrame>
        <StatusBar
          context={state.context}
          room={_.get(state, "context.room.name")}
          version="1.4.0"
        />

        {supported ? (
          <Screen state={state.value} context={state.context} send={send} />
        ) : (
          <div
            style={{
              textAlign: "center",
              padding: "2em",
              color: "#fff",
              height: "80%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <h1 style={{ fontWeight: 300, margin: 0 }}>
              Browser not supported.
            </h1>
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
      return <RoomStartScreen send={send} context={context} colors={colors} />;

    case "error":
      return <ErrorScreen send={send} context={context} />;

    case "create_room":
      return <FetchedRoom send={send} context={context} colors={colors} />;

    case "stream_room":
      return <RoomWorkspace send={send} context={context} />;

    case "enter_password":
      return <EnterPassword send={send} context={context} />;

    default:
      return <></>;
  }
}
