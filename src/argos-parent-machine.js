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

      cue_mix_state: {},

      master: {
        name: "master",
        vol: [0, 0.5, 1],
        pan: [0, 0.5, 1],
        reverb: false,
        comp: false,
        eq: [
          { type: "hpf", in: true, freq: 0, freqMax: 100 },
          { type: "lpf", in: false, freq: 0, freqMax: 100 },
          {
            type: "band1",
            in: false,
            freq: 0,
            amp: 0,
          },
          {
            type: "band2",
            in: false,
            freq: 0,
            amp: 0,
          },
          {
            type: "band3",
            in: false,
            freq: 0,
            amp: 0,
          },
          {
            type: "highShelf",
            in: false,
            freq: 0,
            amp: 0,
          },
          {
            type: "lowShelf",
            in: false,
            freq: 0,
            amp: 0,
          },
        ],
      },

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
              amp: 0,
            },
            {
              type: "band2",
              in: false,
              freq: 0,
              amp: 0,
            },
            {
              type: "band3",
              in: false,
              freq: 0,
              amp: 0,
            },
            {
              type: "highShelf",
              in: false,
              freq: 0,
              amp: 0,
            },
            {
              type: "lowShelf",
              in: false,
              freq: 0,
              amp: 0,
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
              amp: 0,
            },
            {
              type: "band2",
              in: false,
              freq: 0,
              amp: 0,
            },
            {
              type: "band3",
              in: false,
              freq: 0,
              amp: 0,
            },
            {
              type: "highShelf",
              in: false,
              freq: 0,
              amp: 0,
            },
            {
              type: "lowShelf",
              in: false,
              freq: 0,
              amp: 0,
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
              amp: 0,
            },
            {
              type: "band2",
              in: false,
              freq: 0,
              amp: 0,
            },
            {
              type: "band3",
              in: false,
              freq: 0,
              amp: 0,
            },
            {
              type: "highShelf",
              in: false,
              freq: 0,
              amp: 0,
            },
            {
              type: "lowShelf",
              in: false,
              freq: 0,
              amp: 0,
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
              amp: 0,
            },
            {
              type: "band2",
              in: false,
              freq: 0,
              amp: 0,
            },
            {
              type: "band3",
              in: false,
              freq: 0,
              amp: 0,
            },
            {
              type: "highShelf",
              in: false,
              freq: 0,
              amp: 0,
            },
            {
              type: "lowShelf",
              in: false,
              freq: 0,
              amp: 0,
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
              amp: 0,
            },
            {
              type: "band2",
              in: false,
              freq: 0,
              amp: 0,
            },
            {
              type: "band3",
              in: false,
              freq: 0,
              amp: 0,
            },
            {
              type: "highShelf",
              in: false,
              freq: 0,
              amp: 0,
            },
            {
              type: "lowShelf",
              in: false,
              freq: 0,
              amp: 0,
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
              token: (_, event) => {
                return event.token;
              },

              passcode: (_, event) => {
                return event.passcode;
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

      stream_room: {
        on: {
          UPDATE_CUE_MIX_STATE: {
            actions: assign({
              cue_mix_state: (context, event) => {
                let _cueMixState = { ...context.cue_mix_state };
                _cueMixState[event.target] = event.data;
                return _cueMixState;
              },
            }),
          },

          PING: {
            actions: assign({
              ping: (context, event) => {
                let _ping = { ...context.ping };
                _ping[event.id] = [event.timestamp, _ping[event.id]?.[1]];

                return _ping;
              },
            }),
          },

          PONG: {
            actions: assign({
              ping: (context, event) => {
                let _ping = { ...context.ping };
                _ping[event.id] = [_ping[event.id]?.[0], event.timestamp];

                return _ping;
              },
            }),
          },
        },
      },

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
              passcode: (_, event) => {
                return event.passcode;
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
      DISCONNECT: { target: "server_connected", room: "Not Connected" },
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
