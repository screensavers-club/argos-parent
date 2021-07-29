import { useEffect, useRef, useState } from "react";
import Peer from "peerjs";
import AppFrame from "./components/app-frame";
import StatusBar from "./components/status-bar";
import StartScreen from "./pages/start-screen";
import RoomStart from "./pages/room_start";
import FetchedRoom from "./pages/fetched_room";
import Error from "./pages/error";
import StreamRoom from "./pages/stream_room";
import SelectRooms from "./pages/select_room";
import EnterPassword from "./pages/enter_password";
import RoomJoined from "./pages/room_joined";

import _ from "lodash";

import { useMachine } from "@xstate/react";
import argosParentMachine from "./argos-parent-machine.js";
import { inspect } from "@xstate/inspect";

function App() {
  let peer;

  if (process.env.NODE_ENV !== "production") {
    inspect({
      iframe: false,
    });
  }

  let [state, send] = useMachine(argosParentMachine, {
    devTools:
      process.env.NODE_ENV === "development" && typeof window !== "undefined",
  });

  let [pw, setPw] = useState("");
  let [number, setNumber] = useState();
  return (
    <div className="App">
      <AppFrame>
        <StatusBar room={_.get(state, "context.room.name")} />
        <Screen state={state.value} context={state.context} send={send} />
        {/* {state.value === "connected" ? (
          <RoomStart
            newRoomClick={() => {
              send("CREATE_ROOM");
            }}
            joinRoomClick={() => {
              send("JOIN_ROOM");
            }}
          />
        ) : (
          <></>
        )}
        {state.value === "fetched_room" ? (
          <>
            <FetchedRoom
              passwords={[
                { password: number },
                { password: number },
                { password: number },
                { password: number },
                { password: number },
              ]}
              roomName={_.get(state, "context.room.name")}
              resetClick={() => {
                send("RESET");
              }}
              reRoll={() => {
                send("REROLL_ROOM_NAME");
              }}
              goClick={() => {
                send("SET_PASSWORD");
              }}
            />
          </>
        ) : (
          <></>
        )}
        {state.value === "stream_room" ? (
          <StreamRoom
            resetClick={() => {
              send("RESET");
            }}
            error={_.get(state, "context.error.message")}
          />
        ) : (
          <></>
        )}
        {state.value === "error" ? (
          <>
            <Error
              resetClick={() => {
                send("RESET");
              }}
              error={_.get(state, "context.error.message")}
            />
          </>
        ) : (
          <></>
        )}
        {state.value === "select_room" ? (
          <SelectRooms
            rooms={_.get(state, "context.rooms_available")}
            resetClick={() => {
              send("RESET");
            }}
            send={send}
          />
        ) : (
          <></>
        )}
        {state.value === "enter_password" ? (
          <EnterPassword
            roomName={_.get(state, "context.room.name")}
            resetClick={() => {
              send("RESET");
            }}
            joinRoom={() => {
              send("JOIN_ROOM");
            }}
          />
        ) : (
          <></>
        )}
        {state.value === "room_joined" ? (
          <RoomJoined
            roomName={_.get(state, "context.room.name")}
            resetClick={() => {
              send("RESET");
            }}
          />
        ) : (
          <></>
        )}
        } */}
      </AppFrame>
    </div>
  );
}

export default App;

function Screen({ context, state, send }) {
  switch (state) {
    case "start":
      return <StartScreen />;
    case "connected":
      return <CreateRoomScreen />;
  }
  return <div></div>;
}

function CreateRoomScreen() {
  return <div></div>;
}
