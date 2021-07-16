import { createMachine, assign, send } from "xstate";

let argosParentMachine = createMachine({
  id: "ArgosParent",
  initial: "start",
  context: { room: {}, children: [] },
  states: {
    start: { on: { CREATE_ROOM: { target: "create_room" } } },

    create_room: {
      context: {
        room: "hello",
      },

      on: {
        SUCCESS: {
          target: "assigned_room_name",
          room: "roomID_#",
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

    failure_alert: {
      context: {
        room: "hello",
      },
      on: {
        RETRY: "start",
      },
      actions: assign({
        room: (context, event) => {
          return { ...context.room, name: event.data.room };
        },
      }),
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
});

export default argosParentMachine;
