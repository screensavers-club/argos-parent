import { createMachine, assign, send } from "xstate";
import axios from "axios";
import { result } from "lodash";

let argosParentMachine = createMachine(
  {
    id: "ArgosParent",
    initial: "start",
    context: {
      identity: null,
      room: {},
      children: [],
      error: {},
      rooms_available: [],
      token: "",
      joining_room: "",
    },
    states: {
      start: {
        invoke: {
          id: "generate_new_identity",
          src: (context, event) => {
            return axios.post(
              `${process.env.REACT_APP_PEER_SERVER}/session/new`
            );
          },
          onDone: {
            target: "server_connected",
            actions: assign({
              identity: (context, event) => {
                return event.data.data.identity;
              },
            }),
          },
          onError: {
            target: "error",
            actions: assign({
              error: (context, event) => {
                return { message: "cannot connect to server" };
              },
            }),
          },
        },
      },

      error: {
        context: {
          room: "error",
          error: (context, event) => {
            return { ...context.error, message: event.data.message };
          },
        },
      },

      server_connected: {
        on: {
          CREATE_ROOM: { target: "create_room" },
          JOIN_ROOM: { target: "select_room" },
        },
      },

      create_room: {
        invoke: {
          id: "fetch_room_name",
          src: (context, event) => {
            return axios.get(
              `${process.env.REACT_APP_PEER_SERVER}/generate-room-name`
            );
          },

          onDone: {
            actions: assign({
              room: (context, event) => {
                return { ...context.room, name: event.data.data.name };
              },
            }),
          },

          onError: {
            target: "error",
            actions: assign({
              error: (context, event) => {
                return { message: event.data.message };
              },
            }),
          },
        },

        on: {
          RECEIVE_TOKEN: {
            target: "stream_room",
            actions: assign({
              token: (context, event) => {
                console.log(event);
                return event.token;
              },
            }),
          },

          SET_NEW_ROOM_NAME: {
            actions: assign({
              room: (context, event) => {
                return { ...context.room, name: event.name };
              },
            }),
          },
        },
      },

      stream_room: {},

      select_room: {
        on: {
          ROOM_SELECTED: {
            target: "enter_password",
            actions: assign({
              joining_room: (context, event) => {
                console.log(event.room);
                return event.room;
              },
            }),
          },

          RETRIEVE_ROOMS: {
            actions: assign({
              rooms_available: (context, event) => {
                // console.log(event.rooms_available);
                return event.rooms_available;
              },
            }),
          },
        },
      },

      enter_password: {
        on: {
          CHECK_INPUT: {
            target: "room_joined",
            actions: assign({
              token: (context, event) => {
                return event.token;
              },
              room: (context, event) => {
                return { name: context.joining_room };
              },
            }),
          },
        },
      },

      room_joined: {
        context: {
          room: "room_joined",
          id: "room_joined",
        },
      },
    },

    on: {
      actions: assign({
        room: (context, event) => {
          return { ...context.room, name: event.data.room };
        },
      }),
      RESET: { target: "server_connected", room: "Not Connected" },
    },
  },
  {
    actions: {
      assign_room_name: (context, event) => {
        console.log(context, event);
        if (event.type === "SUCCESS") {
          context.room.name = event.name;
        }
      },
    },
  }
);

export default argosParentMachine;
