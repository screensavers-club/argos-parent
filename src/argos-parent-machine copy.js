import { createMachine, assign, send } from "xstate";

let argosParentMachine = createMachine({
  id: "ArgosParent",
  initial: "start",
  context: { room: {}, children: [] },
  states: {
    start: { on: { CREATE_ROOM: { target: "create_room" } } },

    create_room: {
      on: {
        SUCESS: {
          target: "room_name_generated",
        },
        FAILURE: {
          target: "retry",
        },
      },
    },

    retry: {
      on: { RETRY: "start" },
    },

    room_name_generated: {
      initial: "get_room_name",

      states: {
        // error_getting_room: {
        //   invoke:{
        //     id: "error_getting_room"
        //   }
        // },f

        get_room_name: {
          invoke: {
            id: "do_get_room_name",
            src: (context) => {
              return new Promise((resolve, reject) => {
                window.setTimeout(() => {
                  Math.random() > 0.5
                    ? resolve({ room: "generated_room_name" })
                    : reject({
                        error: "couldn't get a name",
                        room: "couldn't generate room",
                      });
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
              //ADD POP UP MESSAGE FOR ERROR AND ASKS FOR RETRY
              actions: assign({
                room: (context, event) => {
                  return { ...context.room, name: event.data.room };
                },
              }),
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
        RESET: { target: "start", room: "Not Connected" },
      },
    },
  },
});

export default argosParentMachine;
