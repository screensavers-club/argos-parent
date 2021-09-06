import { createMachine, assign, send } from "xstate";
import axios from "axios";

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
      master: { name: "master", vol: [0, 0.5, 1], pan: [0, 0.5, 1] },
      input: [
        {
          name: "performer 1",
          id: "p1",
          track: "aaa",
          vol: [0, 0.5, 1],
          solo: false,
          mute: false,
          comp: false,
          reverb: false,
          pan: [0, 0.5, 1],
          eq: [
            { type: "hpf", in: true, freq: 0, freqMax: 100 },
            { type: "lpf", in: false, freq: 0, freqMax: 100 },
            {
              type: "band1",
              in: false,
              freq: 0,
              freqMax: 100,
              amp: 0,
              ampMax: 10,
            },
            {
              type: "band2",
              in: false,
              freq: 0,
              freqMax: 100,
              amp: 0,
              ampMax: 10,
            },
            {
              type: "band3",
              in: false,
              freq: 0,
              freqMax: 100,
              amp: 0,
              ampMax: 10,
            },
            {
              type: "highShelf",
              in: false,
              freq: 0,
              freqMax: 100,
              amp: 0,
              ampMax: 10,
            },
            {
              type: "lowShelf",
              in: false,
              freq: 0,
              freqMax: 100,
              amp: 0,
              ampMax: 10,
            },
          ],
        },
        {
          name: "performer 2",
          id: "p2",
          track: "aaa",
          vol: [0, 0.5, 1],
          solo: false,
          mute: false,
          comp: false,
          reverb: false,
          pan: [0, 0.5, 1],
          eq: [
            { type: "hpf", in: true, freq: 0, freqMax: 100 },
            { type: "lpf", in: false, freq: 0, freqMax: 100 },
            {
              type: "band1",
              in: false,
              freq: 0,
              freqMax: 100,
              amp: 0,
              ampMax: 10,
            },
            {
              type: "band2",
              in: false,
              freq: 0,
              freqMax: 100,
              amp: 0,
              ampMax: 10,
            },
            {
              type: "band3",
              in: false,
              freq: 0,
              freqMax: 100,
              amp: 0,
              ampMax: 10,
            },
            {
              type: "highShelf",
              in: false,
              freq: 0,
              freqMax: 100,
              amp: 0,
              ampMax: 10,
            },
            {
              type: "lowShelf",
              in: false,
              freq: 0,
              freqMax: 100,
              amp: 0,
              ampMax: 10,
            },
          ],
        },

        {
          name: "performer 3",
          id: "p3",
          track: "aaa",
          vol: [0, 0.5, 1],
          solo: false,
          mute: false,
          comp: false,
          reverb: false,
          pan: [0, 0.5, 1],
          eq: [
            { type: "hpf", in: true, freq: 0, freqMax: 100 },
            { type: "lpf", in: false, freq: 0, freqMax: 100 },
            {
              type: "band1",
              in: false,
              freq: 0,
              freqMax: 100,
              amp: 0,
              ampMax: 10,
            },
            {
              type: "band2",
              in: false,
              freq: 0,
              freqMax: 100,
              amp: 0,
              ampMax: 10,
            },
            {
              type: "band3",
              in: false,
              freq: 0,
              freqMax: 100,
              amp: 0,
              ampMax: 10,
            },
            {
              type: "highShelf",
              in: false,
              freq: 0,
              freqMax: 100,
              amp: 0,
              ampMax: 10,
            },
            {
              type: "lowShelf",
              in: false,
              freq: 0,
              freqMax: 100,
              amp: 0,
              ampMax: 10,
            },
          ],
        },

        {
          name: "performer 4",
          id: "p4",
          track: "aaa",
          vol: [0, 0.5, 1],
          solo: false,
          mute: false,
          comp: false,
          reverb: false,
          pan: [0, 0.5, 1],
          eq: [
            { type: "hpf", in: true, freq: 0, freqMax: 100 },
            { type: "lpf", in: false, freq: 0, freqMax: 100 },
            {
              type: "band1",
              in: false,
              freq: 0,
              freqMax: 100,
              amp: 0,
              ampMax: 10,
            },
            {
              type: "band2",
              in: false,
              freq: 0,
              freqMax: 100,
              amp: 0,
              ampMax: 10,
            },
            {
              type: "band3",
              in: false,
              freq: 0,
              freqMax: 100,
              amp: 0,
              ampMax: 10,
            },
            {
              type: "highShelf",
              in: false,
              freq: 0,
              freqMax: 100,
              amp: 0,
              ampMax: 10,
            },
            {
              type: "lowShelf",
              in: false,
              freq: 0,
              freqMax: 100,
              amp: 0,
              ampMax: 10,
            },
          ],
        },

        {
          name: "performer 5",
          id: "p5",
          track: "aaa",
          vol: [0, 0.5, 1],
          solo: false,
          mute: false,
          comp: false,
          reverb: false,
          pan: [0, 0.5, 1],
          eq: [
            { type: "hpf", in: true, freq: 0, freqMax: 100 },
            { type: "lpf", in: false, freq: 0, freqMax: 100 },
            {
              type: "band1",
              in: false,
              freq: 0,
              freqMax: 100,
              amp: 0,
              ampMax: 10,
            },
            {
              type: "band2",
              in: false,
              freq: 0,
              freqMax: 100,
              amp: 0,
              ampMax: 10,
            },
            {
              type: "band3",
              in: false,
              freq: 0,
              freqMax: 100,
              amp: 0,
              ampMax: 10,
            },
            {
              type: "highShelf",
              in: false,
              freq: 0,
              freqMax: 100,
              amp: 0,
              ampMax: 10,
            },
            {
              type: "lowShelf",
              in: false,
              freq: 0,
              freqMax: 100,
              amp: 0,
              ampMax: 10,
            },
          ],
        },
      ],
    },
    states: {
      start: {
        on: {
          SET_IDENTITY: {
            target: "server_connected",
            actions: assign({
              identity: (context, event) => {
                return event.identity;
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
                // console.log(event.room);
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
            target: "stream_room",
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
        // console.log(context, event);
        if (event.type === "SUCCESS") {
          context.room.name = event.name;
        }
      },
    },
  }
);

export default argosParentMachine;
