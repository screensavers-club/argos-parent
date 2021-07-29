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
            target: "connected",
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

      connected: {
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
          SET_PASSWORD: "stream_room",

          SET_NEW_ROOM_NAME: {
            actions: assign({
              room: (context, event) => {
                return { ...context.room, name: event.name };
              },
            }),
          },
        },
      },

      stream_room: {
        context: {
          room: "stream_room",
        },
      },

      select_room: {
        context: {
          room: "select_room",
          id: "select_room",
        },

        invoke: {
          id: "fetch_room_name",
          src: (context, event) => {
            return axios.get(
              `http://${process.env.REACT_APP_LIVEKIT_SERVER}/rooms`
            );
          },

          onDone: {
            actions: assign({
              rooms_available: (context, event) => {
                console.log(event);
                return event.data.data;
              },
            }),
          },
          onError: {
            // actions: assign({
            //   error: (context, event) => {
            //     console.log(event.data.message);
            //     return { message: event.data.message };
            //   },
            // }),
          },
        },

        on: {
          ROOM_SELECTED: {
            target: "enter_password",
            actions: assign({
              room: (context, event) => {
                console.log(event);
                return { name: event.name };
              },
            }),
          },
        },
      },

      enter_password: {
        context: {
          room: "enter_password",
          id: "enter_password",
        },

        actions: assign({
          room: (context, event) => {
            console.log(event);
            return context.data.data;
          },
        }),

        on: {
          JOIN_ROOM: {
            target: "room_joined",
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
      RESET: { target: "connected", room: "Not Connected" },
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
