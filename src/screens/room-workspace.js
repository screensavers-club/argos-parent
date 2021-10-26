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
export default function RoomWorkspace({ context, send }) {
  const { room, connect, participants, audioTracks } = useRoom();
  const [selectTab, setSelectTab] = useState("stream-controls");
  const [exiting, setExiting] = useState(false);
  const exitingModalRef = useRef();

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

        if (obj.type === "PONG") {
          let d = new Date();
          send("PONG", { id: participant.sid, timestamp: d });
        }
      });
    }
  }, [room]);

  useEffect(() => {
    send("UPDATE_PARTICIPANTS", { participants });
  }, [participants]);

  useEffect(() => {
    connect(`${process.env.REACT_APP_LIVEKIT_SERVER}`, context.token)
      .then((room) => {})
      .catch((err) => console.log({ err }));
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
          // return (
          //   <VideoLayoutEditor
          //     room={room}
          //     participants={participants}
          //     videoTrackRefsState={videoTrackRefsState}
          //   />
          // );

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

function VideoFrame({ track }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) {
      return;
    }
    el.muted = true;
    track?.videoTrack?.track?.attach(el);
    el.play();

    return () => {
      track?.videoTrack?.track?.detach(el);
    };
  }, []);
  return (
    <div data-key={track?.videoTrack?.track?.sid}>
      <video ref={ref} muted autoPlay key={track?.videoTrack?.track?.sid} />
    </div>
  );
}

function VideoLayoutEditor({
  onChange,
  room,
  participants,
  videoTrackRefsState,
}) {
  const [editing, setEditing] = useState(null);
  const [previewLayout, setPreviewLayout] = useState(null);
  const encoder = new TextEncoder();

  // useEffect(() => {
  //   if (room) {
  //     room.removeAllListeners(RoomEvent.DataReceived);
  //     room.on(RoomEvent.DataReceived, (payload, participant) => {
  //       const decoder = new TextDecoder();
  //       if (editing === participant.identity) {
  //         const str = decoder.decode(payload);
  //         const obj = JSON.parse(str);
  //         if (!obj?.current_layout) {
  //           return;
  //         }
  //         const targetLayout = {
  //           ...VideoLayouts[
  //             Object.keys(VideoLayouts).find(
  //               (key) => key === obj.current_layout.type
  //             )
  //           ],
  //         };
  //         if (targetLayout === {}) {
  //           return;
  //         }
  //         var layout = targetLayout;
  //         layout.type = obj.current_layout.type;

  //         layout.slots = targetLayout.slots.map((slot, i) => {
  //           let _slot = { ...slot };
  //           _slot.track = obj.current_layout.slots[i].track || "";
  //           return _slot;
  //         });
  //         setPreviewLayout(layout);
  //       }
  //     });
  //   }
  // }, [room, editing]);

  function UpdateRemoteLayout(layout, targetIdentity) {
    const data = encoder.encode(
      JSON.stringify({
        action: "UPDATE_LAYOUT",
        layout,
      })
    );
    if (room) {
      const targetSid = participants.find(
        (p) => p.identity === targetIdentity
      )?.sid;
      if (!targetSid) {
        return;
      }
      room.localParticipant.publishData(data, DataPacket_Kind.RELIABLE, [
        targetSid,
      ]);
    }
  }

  return (
    <VideoLayoutEditorDiv>
      <div className="participantList">
        {participants
          .filter((p) => JSON.parse(p.metadata).type === "CHILD")
          .map((participant, i) => {
            let videoTrack;
            participant.videoTracks?.forEach((value, key) => {
              if (videoTrack) {
                return;
              }
              videoTrack = key;
            });
            return (
              <div
                onClick={() => {
                  setEditing(participant.identity);
                  const data = encoder.encode(
                    JSON.stringify({
                      action: "REQUEST_CURRENT_LAYOUT",
                    })
                  );

                  room.localParticipant.publishData(
                    data,
                    DataPacket_Kind.RELIABLE,
                    [participant.sid]
                  );
                }}
                className={`participant${
                  editing === participant.identity ? " active" : ""
                }`}
                key={videoTrack || "participant" + i}
              >
                <div className="thumbnail">
                  <UserIcon />
                  {JSON.parse(participant.metadata).nickname}
                </div>
              </div>
            );
          })}
      </div>

      <div className="canvas">
        <div className="grid">
          {new Array(10 * 10).fill(0).map((_, i) => {
            return <div key={`grid_line_${i}`}></div>;
          })}
        </div>
        <div className="video_container">
          {previewLayout ? (
            previewLayout.slots.map((slot, index) => {
              return (
                <VideoSlot
                  slot={slot}
                  availableVideos={videoTrackRefsState}
                  onUpdate={(trackSid) => {
                    let _layout = { ...previewLayout };
                    _layout.slots[index].track = trackSid;
                    console.log(_layout);
                    UpdateRemoteLayout(_layout, editing);
                  }}
                  key={`slot_${index}_${slot.track}`}
                  track={slot.track}
                />
              );
            })
          ) : (
            <></>
          )}
        </div>
      </div>

      <div className={`layout ${!editing ? " locked" : ""}`}>
        <label>Modes</label>
        <br />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "10px",
          }}
        >
          {Object.keys(VideoLayouts).map((key) => {
            return (
              <button
                key={key}
                onClick={() => {
                  let _tracks = previewLayout.slots.map((s) => s.track);
                  let _layout = { ...VideoLayouts[key] };
                  _layout.slots = VideoLayouts[key].slots.map((slot, i) => {
                    let _s = slot;
                    _s.track = _tracks[i];
                    return _s;
                  });
                  _layout.type = key;

                  setPreviewLayout(_layout);
                }}
              >
                <img src={VideoLayouts[key].icon} alt={key} />
              </button>
            );
          })}
        </div>
      </div>
    </VideoLayoutEditorDiv>
  );
}

function VideoSlot({ slot, onUpdate, availableVideos, track }) {
  const [selectedVideo, setSelectedVideo] = useState(track);

  useEffect(() => {
    onUpdate(selectedVideo);
  }, [selectedVideo, onUpdate]);
  return (
    <div
      className="slot"
      style={{
        width: `${slot.size[0]}%`,
        height: `${slot.size[1]}%`,
        top: `${slot.position[1]}%`,
        left: `${slot.position[0]}%`,
      }}
    >
      {selectedVideo && availableVideos[selectedVideo] ? (
        <VideoFrame
          key={selectedVideo}
          track={availableVideos[selectedVideo]}
        />
      ) : (
        false
      )}
      <select
        value={selectedVideo}
        onChange={(e) => {
          setSelectedVideo(e.target.value);
        }}
      >
        <option value="">--</option>
        {Object.keys(availableVideos).map((key) => {
          console.log(availableVideos);
          return (
            <option key={key} value={key}>
              {availableVideos[key].nickname}
            </option>
          );
        })}
      </select>
    </div>
  );
}

const VideoLayoutEditorDiv = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: 15% 70% 15%;

  div.participantList {
    .participant {
      display: flex;
      border-bottom: 1px solid #aaa;
      cursor: pointer;
      padding: 5px;

      &.active {
        background: #ff9;
      }

      .thumbnail {
        display: flex;
        align-items: center;
      }
    }
  }

  div.canvas {
    position: relative;
    border: 1px solid #ddd;
    height: 0;
    border-bottom: 0;
    border-right: 0;
    box-sizing: border-box;
    padding-top: 56%;
    margin: 10px;

    .grid {
      display: flex;
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      flex-wrap: wrap;

      > div {
        box-sizing: border-box;
        width: 10%;
        height: 10%;
        border: 1px solid #ddd;
        border-top: 0;
        border-left: 0;
      }
    }

    .slot {
      background: rgba(255, 255, 255, 0.5);
      position: absolute;
      border: 1px solid #000;
      box-sizing: border-box;

      > div {
        width: 100%;
        height: 100%;

        > video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      select {
        position: absolute;
        bottom: 10px;
        right: 10px;
      }
    }
  }

  .layout {
    &.locked {
      opacity: 0.3;
      pointer-events: none;
    }

    label {
      display: block;
    }
    button {
      cursor: pointer;
      display: block;
      padding: 10px;
      border: 1px solid #000;
      background: #fff;
      margin: 0 0 5px 0;
      img {
        width: 40px;
      }
    }
  }
`;
