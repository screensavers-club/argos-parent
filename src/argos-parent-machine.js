import { createMachine, assign, send } from "xstate";

let argosParentMachine = createMachine({
  id: "ArgosParent",
  initial: "start",
  context: { room: {}, children: [] },
  states: {
    start: { on: { CREATE_ROOM: { target: "create_room" } } },

    cool: {},

    create_room: {
      initial: "get_room_name",

      states: {
        get_room_name: {
          invoke: {
            id: "do_get_room_name",
            src: (context) => {
              return new Promise((resolve, reject) => {
                window.setTimeout(() => {
                  Math.random() > 0.5
                    ? resolve({ room: "hello" })
                    : reject({ error: "couldn't get a name" });
                }, 2000);
              });
            },
            onDone: {
              target: "set_password",
              actions: assign({
                room: (context, event) => {
                  return { ...context.room, name: event.data.room };
                },
              }),
            },
            onError: {
              actions: send("RESET"),
            },
          },
        },

        set_password: {
          on: {
            SET_PASSWORD: {
              target: "room_created",
              actions: assign({
                room: (context, event) => {
                  return { ...context.room, password: event.password };
                },
              }),
            },
          },
        },

        room_created: {},
      },

      on: {
        RESET: { target: "start" },
      },
    },
  },
});

export default argosParentMachine;
