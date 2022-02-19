import axios from "axios";
import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import Button from "../components/button";
import { DataPacket_Kind, RoomEvent } from "livekit-client";
import { useRoom, AudioRenderer } from "livekit-react";
import { Chat, Exit } from "react-ikonate";

import EditorTabs from "../components/editor-tabs";
import StreamEditor from "../components/stream-editor/stream-editor";
import LayoutEditor from "../components/layout-editor";
import RoomSaveLoad from "../components/room-save-load";

export default function RoomWorkspace({ context, send }) {
  const { room, connect, participants } = useRoom();
  const [selectTab, setSelectTab] = useState("stream-controls");
  const [exiting, setExiting] = useState(false);
  const exitingModalRef = useRef();
  const [mix, setMix] = useState([]);

  const [mixSlots, setMixSlots] = useState();
  const [layoutSlots, setLayoutSlots] = useState();

  const [showMessage, setShowMessage] = useState(false);
  const showMessageTimeout = useRef();

  const [enterMessage, setEnterMessage] = useState("");
  const [showEnterMessage, setShowEnterMessage] = useState(false);
  const enterMessageRef = useRef();

  const updateSlotNames = () => {
    if (!room) {
      return;
    }
    axios
      .get(`${process.env.REACT_APP_PEER_SERVER}/${room.name}/slotnames`)
      .then(({ data }) => {
        const _mixSlots = [
          "Slot 1",
          "Slot 2",
          "Slot 3",
          "Slot 4",
          "Slot 5",
          "Slot 6",
          "Slot 7",
          "Slot 8",
          "Slot 9",
          "Slot 10",
          "Slot 11",
          "Slot 12",
        ].map((slot, i) => {
          return data.mix[`slot${i}`] || slot;
        });

        const _layoutSlots = [
          "Slot 1",
          "Slot 2",
          "Slot 3",
          "Slot 4",
          "Slot 5",
          "Slot 6",
          "Slot 7",
          "Slot 8",
          "Slot 9",
          "Slot 10",
          "Slot 11",
          "Slot 12",
        ].map((slot, i) => {
          return data.layout[`slot${i}`] || slot;
        });

        setMixSlots(_mixSlots);
        setLayoutSlots(_layoutSlots);
      });
  };

  const handleClick = (e) => {
    if (!exitingModalRef.current.contains(e.target)) {
      setExiting(false);
    }

    if (!enterMessageRef.current.contains(e.target)) {
      setShowEnterMessage(false);
      setEnterMessage("");
    }
  };
  const handleEsc = (e) => {
    if (e.key === "Escape") {
      setExiting(false);
      setShowEnterMessage(false);
      setEnterMessage("");
    } else return;
  };

  const flashMessage = ({ sender, message }) => {
    setShowMessage({ sender, message });
  };

  const sendMessage = () => {
    const payload = {
      sender: "PARENT",
      message: enterMessage,
      action: "MESSAGE",
    };
    const data = new TextEncoder().encode(JSON.stringify(payload));
    if (typeof room.localParticipant.publishData === "function") {
      room.localParticipant
        .publishData(data, DataPacket_Kind.RELIABLE)
        .then(() => {
          setEnterMessage("");
          setShowEnterMessage(false);
          setShowMessage(payload);
        });
    }
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
    if (room && room.name) {
      updateSlotNames();
    }
  }, [room]);

  useEffect(() => {
    if (room) {
      room.on(RoomEvent.DataReceived, (payload, participant) => {
        const decoder = new TextDecoder();
        const str = decoder.decode(payload);
        const obj = JSON.parse(str);

        if (obj?.type === "PONG") {
          let d = new Date();
          send("PONG", { id: participant.sid, timestamp: d });
        }

        if (obj?.action === "MESSAGE") {
          flashMessage({ message: obj.message, sender: obj.sender });
        }
      });

      return () => {
        room.removeAllListeners(RoomEvent.DataReceived);
      };
    }
  }, [room]);

  useEffect(() => {
    send("UPDATE_PARTICIPANTS", { participants });
    updateMix();
  }, [participants]);

  useEffect(() => {
    connect(`${process.env.REACT_APP_LIVEKIT_SERVER}`, context.token).catch(
      (err) => console.log({ err })
    );
    return () => {
      room?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (showMessage === false) {
      return;
    }

    if (showMessageTimeout.current) {
      window.clearTimeout(showMessageTimeout.current);
    }

    showMessageTimeout.current = window.setTimeout(() => {
      setShowMessage(false);
    }, 5000);
  }, [showMessage]);

  function updateMix() {
    if (!room) {
      return;
    }
    axios
      .get(`${process.env.REACT_APP_PEER_SERVER}/${room.name}/PARENT/mix`)
      .then(({ data }) => {
        const _participants = participants
          .filter((p) => JSON.parse(p.metadata)?.type === "CHILD")
          .filter((p) => {
            let _nick = JSON.parse(p.metadata || "{}")?.nickname;
            return data.mix?.mute?.indexOf(_nick) < 0;
          });
        const _mix = _participants.reduce((p, c) => {
          let _pubs = Array.from(c.audioTracks, ([_, pub]) => pub);
          return [...p, ..._pubs];
        }, []);
        setMix(_mix);
      });
  }

  return (
    <StyledPage>
      {showMessage !== false && (
        <div className="flashMessage">
          <div className="sender">{showMessage.sender}</div>
          <div className="message">{showMessage.message}</div>
        </div>
      )}
      <div className="navigation">
        <RoomSaveLoad room={room} />
        <EditorTabs setSelectTab={setSelectTab} selectedTab={selectTab} />
        <Button
          icon={<Chat />}
          onClick={() => {
            setShowEnterMessage(true);
            const input = enterMessageRef.current.querySelector("input");
            setTimeout(() => {
              input.focus();
            }, 50);
          }}
        >
          Message
        </Button>

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
        {mix.map((pub) => {
          if (pub.track) {
            return <AudioRenderer key={pub.trackSid} track={pub.track} />;
          } else {
            return false;
          }
        })}
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
                updateMix={updateMix}
                mixSlots={mixSlots}
                updateSlots={updateSlotNames}
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
                layoutSlots={layoutSlots}
                updateSlots={updateSlotNames}
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

      <div
        className="enterMessage"
        ref={enterMessageRef}
        style={{ display: showEnterMessage ? "flex" : "none" }}
      >
        <input
          type="text"
          value={enterMessage}
          onChange={(e) => {
            setEnterMessage(e.target.value.toUpperCase().slice(0, 50));
          }}
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
        />
        <label>Enter to send, esc to cancel</label>
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

  div.flashMessage {
    max-width: 500px;
    right: 16px;
    top: 76px;
    z-index: 10;
    position: absolute;
    background: rgba(255, 255, 255, 0.9);
    padding: 25px;
    font-size: 14px;
    border-radius: 25px;

    .sender {
      font-weight: bold;
    }
  }

  div.enterMessage {
    background: #fff;
    display: flex;
    flex-direction: column;
    font-size: 24px;
    position: fixed;
    top: 50%;
    left: 50%;
    z-index: 20;
    transform: translate(-50%, -50%);
    padding: 20px;
    border-radius: 20px;

    input {
    }
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
