import { createMachine, assign, send } from "xstate";
import axios from "axios";

let argosParentMachine = createMachine(
  {
    id: "ArgosParent",
    initial: "start",
    context: { room: {}, children: [] },
    states: {
      start: { on: { CREATE_ROOM: { target: "create_room" } } },

    create_room: {
      context: {
        room: "hello",
      },

      invoke: {
        id: "fetch_room_name",
        src: (context, event) => {
          return axios.get(
            `${process.env.REACT_APP_PEER_SERVER}:${process.env.REACT_APP_PEER_SERVER_PORT}`
          );
          //return a promise
        },
        onDone: {
          target: "fetched_room",
          actions: assign({
            room: (context, event) => {
              return { name: event.data.data.roomName };
            },
          }),
        },
        onError: {
          target: "error",
          actions: assign({
            error: (context, event) => {
              return {
                message: "",
              };
            },
          }),
        },
      },

      on: {
        SUCCESS: {
          target: "assigned_room_name",
          actions: assign({
            room: { name: "roomID_#" },
          }),
        },

        on: {
          SUCCESS: {
            target: "assigned_room_name",
            actions: ["assign_room_name"],
          },

          FAILURE: {
            target: "failure_alert",
            room: "Fail to get room",
          },
        },

        actions: assign({
          room: (context, event) => {
            return { ...context.room, name: event.data.room };
          },
        }),
      },

      // actions: assign({
      //   room: (context, event) => {
      //     return { ...context.room, name: event.data.room };
      //   },
      // }),
    },

    fetched_room: {},

    error: {},

    failure_alert: {
      context: {
        room: "hello",
      },

      assigned_room_name: {
        actions: assign({
          room: (context, event) => {
            return { ...context.room, name: event.data.room };
          },
        }),
        on: { SET_PASSWORD: "room_created" },
      },

      room_created: {},
    },

    on: {
      actions: assign({
        room: (context, event) => {
          return { ...context.room, name: event.data.room };
        },
      }),
      RESET: { target: "start", room: "Not Connected" },
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
