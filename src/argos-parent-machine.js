import { createMachine, assign, send } from "xstate";
import axios from "axios";

function newPromise() {
  return new Promise(function (resolve, reject) {
    if (Math.random() > 0.5) {
      window.setTimeout(() => {
        resolve("success");
      }, 1000);
    } else {
      window.setTimeout(() => {
        reject("failure");
      }, 1000);
    }
  });
}

let argosParentMachine = createMachine(
  {
    id: "ArgosParent",
    initial: "start",
    context: { room: {}, children: [], error: {} },
    states: {
      start: { on: { CREATE_ROOM: { target: "create_room" } } },

      error: {
        context: {
          room: "error",
          error: (context, event) => {
            return { ...context.error, message: event.data.message };
          },
        },
      },

      fetched_room: {
        context: {
          room: "fetched",
        },
        actions: assign({
          room: (context, event) => {
            return { ...context.room, name: event.data.room };
          },
        }),
        on: { SET_PASSWORD: "room_created" },
      },

      create_room: {
        context: {
          id: "create_room",
          room: "create_room",
        },

        invoke: {
          id: "fetch_room_name",
          src: (context, event) => {
            // return newPromise()
            //   .then((result) => {
            //     return result;
            //   })
            //   .catch((err) => {
            //     return err;
            //   });

            return axios.get(
              `${process.env.REACT_APP_PEER_SERVER}:${process.env.REACT_APP_PEER_SERVER_PORT}`
            );
            //return a promise
          },

          onDone: {
            target: "fetched_room",
            actions: assign({
              room: (context, event) => {
                console.log(event);
                return { name: event.data.data.roomName };
              },
            }),
          },
          onError: {
            target: "error",
            actions: assign({
              error: (context, event) => {
                console.log(event.data.message);
                return { message: event.data.message };
              },
            }),
          },
        },

        // on: {
        //   SUCCESS: {
        //     target: "assigned_room_name",
        //     actions: assign({
        //       room: { name: "roomID_#" },
        //     }),
        //   },

        //   FAILURE: {
        //     target: "failure_alert",
        //     room: "Fail to get room",
        //   },
        // },

        // actions: assign({
        //   room: (context, event) => {
        //     return { ...context.room, name: event.data.room };
        //   },
        // }),
      },

      // actions: assign({
      //   room: (context, event) => {
      //     return { ...context.room, name: event.data.room };
      //   },
      // }),

      // assigned_room_name: {
      //   actions: assign({
      //     room: (context, event) => {
      //       return { ...context.room, name: event.data.room };
      //     },
      //   }),
      //   on: { SET_PASSWORD: "room_created" },
      //   context: {
      //     room: "hello",
      //   },
      // },

      room_created: {
        context: {
          room: "hello",
        },
      },
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
