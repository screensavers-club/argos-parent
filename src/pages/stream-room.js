import { useState, useEffect } from "react";
import styled from "styled-components";
import Button from "../components/button";
import { useRoom } from "livekit-react";
import StreamTabs from "../components/stream-tabs";
import StreamPage from "../components/stream-page";
import MixerPage from "../components/mixer-page";
import TogglePerformers from "../components/toggle-performers";

const StyledPage = styled.div`
  position: relative;
  display: block;

  div.roomCreated {
    text-align: center;
    font-size: 1.5rem;
    margin-top: 10%;
  }

  table.participants {
    border: 1px solid black;
    padding: 25px;

    caption {
      border: 1px solid black;
      border-bottom: 2px solid black;
      font-size: 18px;
      font-weight: normal;
    }

    tr.id {
      min-width: 200px;
    }

    thead {
      > div {
        border-top: 2px solid black;
        padding-top: 10px;
        margin-bottom: 10px;
      }
    }
    tbody {
      > div {
        padding-top: 10px;
        margin-bottom: 10px;
        border-top: 2px solid black;
      }
    }
  }

  div.stream {
    position: relative;
    display: flex;
    justify-content: center;
    border: 1px solid black;
    padding: 10px;
    margin: 25px;

    div.userVideos {
      position: relative;

      border: 1px solid red;
      min-width: 50%;
      display: flex;
    }
  }

  div.button {
    position: absolute;
    left: 25px;
    top: 0;
    margin: auto;
    padding: auto;
  }

  div.controlPanel {
    display: block;
    margin: auto;
    padding: auto;
  }
`;

export default function StreamRoom({ context, send, parents }) {
  const input = [
    {
      name: "performer 1",
      id: "p1",
      track: "aaa",
      vol: [0, 0.5, 1],
      solo: false,
      soloLock: false,
      mute: false,
    },
    {
      name: "performer 2",
      id: "p2",
      track: "aaa",
      vol: [0, 0.5, 1],
      solo: false,
      soloLock: false,
      mute: false,
    },
    {
      name: "performer 3",
      id: "p3",
      track: "aaa",
      vol: [0, 0.5, 1],
      solo: false,
      soloLock: false,
      mute: false,
    },
    {
      name: "performer 4",
      id: "p4",
      track: "aaa",
      vol: [0, 0.5, 1],
      solo: false,
      soloLock: false,
      mute: false,
    },
    {
      name: "performer 5",
      id: "p5",
      track: "aaa",
      vol: [0, 0.5, 1],
      solo: false,
      soloLock: false,
      mute: false,
    },
  ];

  const { room, connect } = useRoom();
  const [selectTab, setSelectTab] = useState("stream");

  const [control, setControl] = useState(input);
  let [activeControl, setActiveControl] = useState(0);

  useEffect(() => {
    connect(`${process.env.REACT_AP_LIVEKIT_SERVER}`, context.token);
  }, []);

  return (
    <StyledPage>
      <div className="button">
        <Button
          onClick={() => {
            send("RESET");
          }}
          variant="small"
        >
          End Call
        </Button>
      </div>

      <StreamTabs setSelectTab={setSelectTab} />

      {(function () {
        switch (selectTab) {
          case "stream":
            return (
              <StreamPage
                parents={parents}
                performers={input}
                setSelectTab={setSelectTab}
                activeControl={activeControl}
                setActiveControl={setActiveControl}
                control={control}
                setControl={setControl}
              />
            );

          case "mixer":
            return <MixerPage control={control} setControl={setControl} />;
        }
      })()}
      <TogglePerformers
        control={control}
        activeControl={activeControl}
        setActiveControl={setActiveControl}
      />
    </StyledPage>
  );
}
