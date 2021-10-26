import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import Button from "../components/button";
import { DataPacket_Kind, RoomEvent } from "livekit-client";
import { useRoom, AudioRenderer } from "livekit-react";
import { User as UserIcon, Exit } from "react-ikonate";

import VideoLayouts from "../util/video-layouts";

import EditorTabs from "../components/editor-tabs";
import StreamEditor from "../components/stream-editor/stream-editor";
import LayoutEditor from "../components/layout-editor";
import axios from "axios";

export default function RoomWorkspace({ context, send }) {
  const { room, connect, participants, audioTracks } = useRoom();
  const [selectTab, setSelectTab] = useState("stream-controls");
  const [exiting, setExiting] = useState(false);
  const exitingModalRef = useRef();

  const [mix, setMix] = useState({});

  const handleClick = (e) => {
    if (exitingModalRef.current.contains(e.target)) {
      return;
    }
    setExiting(false);
  };
  const handleEsc = (e) => {
    if (e.key === "Escape") {
      setExiting(false);
    } else return;
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keyup", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keyup", handleEsc);
    };
  }, []);

  useEffect(() => {
    if (room) {
      room.on(RoomEvent.DataReceived, (payload, participant) => {
        const decoder = new TextDecoder();
        const str = decoder.decode(payload);
        const obj = JSON.parse(str);

        console.log("x", obj);

        if (obj.type === "PONG") {
          let d = new Date();
          send("PONG", { id: participant.sid, timestamp: d });
        }

        if (obj.action === "MIX") {
          axios
            .get(`${process.env.REACT_APP_PEER_SERVER}/${room.name}/PARENT/mix`)
            .then((data) => {
              console.log(data.mix, "xx");
            });
        }
      });

      return () => {
        room.removeAllListeners(RoomEvent.DataReceived);
      };
    }
  }, [room]);

  useEffect(() => {
    send("UPDATE_PARTICIPANTS", { participants });
  }, [participants]);

  useEffect(() => {
    connect(`${process.env.REACT_APP_LIVEKIT_SERVER}`, context.token).catch(
      (err) => console.log({ err })
    );
    return () => {
      room?.disconnect();
    };
  }, []);

  return (
    <StyledPage>
      <div className="navigation">
        <EditorTabs setSelectTab={setSelectTab} selectedTab={selectTab} />

        <Button
          onClick={() => {
            setExiting(true);
          }}
          type="secondary"
          icon={<Exit />}
        >
          Exit
        </Button>
      </div>

      <>
        {audioTracks.map((track) => (
          <AudioRenderer track={track} key={track.sid} isLocal={false} />
        ))}
      </>
      {(function () {
        switch (selectTab) {
          case "stream-controls":
            return (
              <StreamEditor
                room={room}
                context={context}
                send={send}
                participants={participants.filter(
                  (p) => JSON.parse(p.metadata)?.type === "CHILD"
                )}
              />
            );

          case "monitor-layout":
            return (
              <LayoutEditor
                room={room}
                context={context}
                send={send}
                participants={participants.filter(
                  (p) => JSON.parse(p.metadata)?.type === "CHILD"
                )}
              />
            );

          default:
            <></>;
        }
      })()}

      <div
        className={`exitingModal ${exiting === true ? "active" : ""}`}
        ref={exitingModalRef}
      >
        <p>Are you sure you want to exit?</p>
        <div>
          <Button
            variant="navigation"
            className="no"
            onClick={() => {
              setExiting(false);
            }}
            icon={<></>}
          >
            no
          </Button>
          <Button
            variant="navigation"
            className="yes"
            onClick={() => {
              room?.disconnect();
              send("DISCONNECT");
              setExiting(false);
            }}
          >
            yes
          </Button>
        </div>
      </div>
    </StyledPage>
  );
}

const StyledPage = styled.div`
  background: #191920;
  position: relative;
  padding: 66px 16px 16px 16px;
  height: calc(100% - 118px);

  div.navigation {
    position: absolute;
    top: 16px;
    left: 16px;
    width: calc(100% - 32px);
    display: flex;
    z-index: 3;
  }

  div.exitingModal {
    display: none;

    &.active {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      box-shadow: 0 0 15px 1px rgba(200, 200, 255, 0.15);
      color: white;
      background: #111115;
      position: fixed;
      width: 300px;
      height: 200px;
      padding: 16px;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      border-radius: 15px;
      z-index: 6;

      p {
        font-size: 1rem;
        text-align: center;
      }

      div {
        width: 100%;
        display: inline-flex;
        justify-content: center;

        > button {
          padding: 5px;
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 5px;
          min-width: 50px;

          ~ .yes {
            background: #f25555;
            color: white;

            :hover {
              cursor: pointer;
              background: #f22222;
            }
          }
        }
      }
    }
  }
`;
