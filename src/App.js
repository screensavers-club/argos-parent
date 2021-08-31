import { useEffect, useRef, useState } from "react";
import Peer from "peerjs";
import AppFrame from "./components/app-frame";
import StatusBar from "./components/status-bar";

import StartScreen from "./pages/start-screen";
import RoomStartScreen from "./pages/room-start-screen";
import ErrorScreen from "./pages/error-screen";
import FetchedRoom from "./pages/create-room-screen";
import StreamRoom from "./pages/stream-room";
import SelectRoom from "./pages/select-room";
import EnterPassword from "./pages/enter-password";
import RoomJoined from "./pages/room-joined";

import _ from "lodash";

import { useMachine } from "@xstate/react";
import argosParentMachine from "./argos-parent-machine.js";
import { inspect } from "@xstate/inspect";

inspect({ iframe: false });

function App() {
  let peer;

  let [state, send] = useMachine(argosParentMachine, {
    devTools:
      process.env.NODE_ENV === "development" && typeof window !== "undefined",
  });

  return (
    <div className="App">
      <AppFrame>
        <StatusBar room={_.get(state, "context.room.name")} />
        <Screen state={state.value} context={state.context} send={send} />
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
      return <RoomStartScreen send={send} />;

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

    case "select_room":
      return <SelectRoom send={send} context={context} />;

    case "enter_password":
      return <EnterPassword send={send} context={context} />;

    case "room_joined":
      return <RoomJoined send={send} context={context} />;
  }
}
