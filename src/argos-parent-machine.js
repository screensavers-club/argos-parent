import { createMachine, assign, send } from "xstate";
import axios from "axios";
import { result } from "lodash";

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
    context: { room: {}, children: [], error: {}, rooms_available: [] },
    states: {
      start: {
        invoke: {
          id: "fetch_room_name",
          src: (context, event) => {
            return axios.get(
              `${process.env.REACT_APP_PEER_SERVER}:${process.env.REACT_APP_PEER_SERVER_PORT}`
            );
          },

          onDone: {
            target: "connected",
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

      connected: {
        on: {
          CREATE_ROOM: { target: "create_room" },
          JOIN_ROOM: { target: "select_room" },
        },
      },

      create_room: {
        context: {
          id: "create_room",
          room: "create_room",
        },

        invoke: {
          id: "fetch_room_name",
          src: (context, event) => {
            return axios.get(
              `http://${process.env.REACT_APP_LIVEKIT_SERVER}/generate-room-name`
            );
          },

          onDone: {
            target: "fetched_room",
            actions: assign({
              room: (context, event) => {
                console.log(event);
                return { name: event.data.data };
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
      },

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
        on: {
          SET_PASSWORD: "stream_room",
          REROLL_ROOM_NAME: {
            action: () => {
              console.log("test");
            },
            // actions: assign({
            //   room: (context, event) => {
            //     console.log({ context, event });
            //     return axios
            //       .get(
            //         `${process.env.REACT_APP_PEER_SERVER}:${process.env.REACT_APP_PEER_SERVER_PORT}`
            //       )
            //       .then((result) => {
            //         console.log({ name: result.data.roomName });
            //         return { name: result.data.roomName };
            //       });
            //   },
            // }),
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
