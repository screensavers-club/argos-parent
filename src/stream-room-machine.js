import { createMachine, assign, send } from "xstate";

let streampageMachine = createMachine(
  {
    id: "StreamRoom",
    initial: "stream_page",
    context: {
      page: {},
      children: [],
      error: {},
    },
    states: {
      stream_page: {
        on: { MIXER: "mixer_page", MONITOR: "monitor_page", OUT: "out_page" },
      },
      mixer_page: {
        on: { STREAM: "stream_page", MONITOR: "monitor_page", OUT: "out_page" },
      },
      monitor_page: {
        on: { STREAM: "stream_page", MIXER: "mixer_page", OUT: "out_page" },
      },
      out_page: {
        on: {
          STREAM: "stream_page",
          MIXER: "mixer_page",
          MONITOR: "monitor_page",
        },
      },
    },

    error: {
      context: {
        page: "error",
        error: (context, event) => {
          return { ...context.error, message: event.data.message };
        },
      },
    },

    stream_page: {
      actions: assign({
        page: (context, event) => {
          return { ...context.page, name: event.data.data.name };
        },
      }),
    },

    on: {
      STREAM: {
        target: "stream_page",
        actions: assign({
          token: (context, event) => {
            return event.token;
          },
        }),
      },
    },
  },

  {
    actions: {
      assign_page_name: (context, event) => {
        console.log(context, event);
        if (event.type === "SUCCESS") {
          context.page.name = event.name;
        }
      },
    },
  }
);

export default streampageMachine;
