import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import Button from "../components/button";
import { useRoom } from "livekit-react";
import StreamTabs from "../components/stream-tabs";
import MixerPage from "../components/mixer-page";

import VideoLayouts from "../util/video-layouts";
import { DataPacket_Kind, RoomEvent } from "livekit-client";

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

  div.exitModal {
    display: none;
    background: blue;
    position: fixed;
    width: 50%;
    height: 50%;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  > div.active {
    display: block;
  }
`;

export default function StreamRoom({ context, send, parents }) {
  const { room, connect, participants, audioTracks } = useRoom();
  const [selectTab, setSelectTab] = useState("stream");
  const [renderState, setRenderState] = useState(0);

  let [exit, setExit] = useState(false);

  const audioCtx = useRef(new AudioContext());
  const audioTrackRefs = useRef({});
  const [audioTrackRefsState, setAudioTrackRefsState] = useState(
    audioTrackRefs.current
  );

  const videoTrackRefs = useRef({});
  const [videoTrackRefsState, setVideoTrackRefsState] = useState(
    videoTrackRefs.current
  );

  useEffect(() => {
    let __tracks = [];
    audioTracks.forEach((audioTrack) => {
      if (__tracks.indexOf(audioTrack.sid) < 0 && audioTrack.mediaStreamTrack) {
        __tracks.push(audioTrack.sid);
        let mst = audioCtx.current.createMediaStreamTrackSource(
          audioTrack.mediaStreamTrack
        );
        let gainNode = new GainNode(audioCtx.current, { gain: 1 });
        audioTrackRefs.current[audioTrack.sid] = {
          mediaStreamTrackSource: mst,
          gainNode: gainNode,
        };
        mst.connect(gainNode).connect(audioCtx.current.destination);
      }
    });

    Object.keys(audioTrackRefs.current).forEach((key) => {
      if (__tracks.indexOf(key) < 0) {
        audioTrackRefs.current[key].mediaStreamTrackSource.disconnect();
        audioTrackRefs.current[key].gainNode.disconnect();
        delete audioTrackRefs.current[key];
      }
    });
    setAudioTrackRefsState(audioTrackRefs.current);
    setRenderState(renderState + 1);
  }, [audioTracks]);

  useEffect(() => {
    let __tracks = [];
    participants.forEach((participant) => {
      if (participant.videoTracks.size < 1) {
        return;
      }

      let firstVideo = null;

      participant.videoTracks.forEach((track, key) => {
        if (!firstVideo) {
          firstVideo = { track, key };
        } else {
          return;
        }
      });

      if (__tracks.indexOf(firstVideo.key) < 0) {
        __tracks.push(firstVideo.key);
        videoTrackRefs.current[firstVideo.key] = {
          videoTrack: firstVideo.track,
          identity: participant.identity,
        };
      }
    });

    Object.keys(videoTrackRefs.current).forEach((key) => {
      if (__tracks.indexOf(key) < 0) {
        delete videoTrackRefs.current[key];
      }
    });
    setVideoTrackRefsState(videoTrackRefs.current);
    setRenderState(renderState + 1);
  }, [participants]);

  const [control, setControl] = useState(context.input);

  useEffect(() => {
    connect(`${process.env.REACT_APP_LIVEKIT_SERVER}`, context.token)
      .then((room) => {
        console.log("room connected");
      })
      .catch((err) => console.log({ err }));
    return () => {
      room?.disconnect();
    };
  }, []);

  return (
    <StyledPage>
      <div className="button">
        <Button
          onClick={() => {
            setExit(true);
          }}
          variant="small"
        >
          Disconnect
        </Button>
      </div>

      <div
        className={`exitModal ${exit === true ? "active" : ""}`}
        // onEsc={() => setExit(false)}
        // onClickOutside={() => setExit(false)}
      >
        Are you sure you want to exit?
        <button
          onClick={() => {
            room?.disconnect();
            send("DISCONNECT");
            setExit(false);
          }}
        >
          yes
        </button>
        <button
          onClick={() => {
            setExit(false);
          }}
        >
          no
        </button>
      </div>

      <StreamTabs setSelectTab={setSelectTab} />

      {(function () {
        switch (selectTab) {
          case "stream":
            return (
              <>
                <MainControlView>
                  <div className="participants">
                    {participants
                      .filter((p) => p.metadata === "CHILD")
                      .map((participant) => {
                        let firstAudioTrack = null;
                        participant.audioTracks.forEach((value, key) => {
                          if (!firstAudioTrack) {
                            firstAudioTrack = value;
                          }
                        });
                        let trackRef =
                          audioTrackRefsState[firstAudioTrack?.trackSid];

                        return (
                          <div
                            style={{ borderBottom: "1px solid #aaa" }}
                            key={participant.identity}
                          >
                            <span className="user">{participant.identity}</span>
                            {trackRef && (
                              <button
                                onClick={() => {
                                  if (trackRef && trackRef?.gainNode) {
                                    let targetGain =
                                      trackRef.gainNode.gain.value === 0
                                        ? 1
                                        : 0;
                                    trackRef.gainNode.gain.setValueAtTime(
                                      targetGain,
                                      audioCtx.current.currentTime
                                    );
                                  }

                                  setRenderState(renderState + 1);
                                }}
                              >
                                {trackRef?.gainNode?.gain?.value
                                  ? "Mute"
                                  : "Unmute"}
                              </button>
                            )}
                          </div>
                        );
                      })}
                  </div>
                  <div className="videos">
                    {Object.keys(videoTrackRefsState).map((key, i) => {
                      if (!videoTrackRefsState[key]?.videoTrack?.track) {
                        return <></>;
                      }
                      return (
                        <div key={key}>
                          <VideoFrame
                            track={videoTrackRefsState[key]}
                            key={key}
                          />
                          <div style={{ display: "flex" }}>
                            <input
                              type="text"
                              id={`stream_url_${key}`}
                              value={`${process.env.REACT_APP_VIEWER_BASE_URL}?room=${context.room.name}&passcode=${context.passcode}&target=${videoTrackRefsState[key].identity}`}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                let input = document.querySelector(
                                  `#${`stream_url_${key}`}`
                                );
                                input.select();
                                document.execCommand("copy");
                              }}
                            >
                              Copy
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div>Controls</div>
                </MainControlView>
              </>
            );

          case "layout":
            return (
              <VideoLayoutEditor
                room={room}
                participants={participants}
                videoTrackRefsState={videoTrackRefsState}
                onChange={() => {}}
              />
            );

          case "mixer":
            return (
              <MixerPage
                control={control}
                setControl={setControl}
                master={context.master}
              />
            );
          case "monitor":
            return <>This is the monitor page</>;

          case "out":
            return <>This is the out page</>;

          default:
            <></>;
        }
      })()}
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

const MainControlView = styled.div`
  width: 100%;
  height: 100vh;
  display: grid;
  grid-template-columns: 15% 70% 15%;

  .participants {
    padding: 10px;
    > div {
      display: flex;
      align-items: center;

      span.user {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        font-size: 12px;
        width: 80%;
        margin: 3px 0;
      }
    }
  }

  .videos {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(4, 1fr);
    width: 100%;
    height: 100%;
    min-height: 80vh;

    > div {
      width: 100%;
      height: 100%;
      object-fit: cover;
      overflow: hidden;

      video {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }
`;

function VideoLayoutEditor({
  onChange,
  room,
  participants,
  videoTrackRefsState,
}) {
  const [editing, setEditing] = useState(null);
  const [previewLayout, setPreviewLayout] = useState(null);
  const encoder = new TextEncoder();

  useEffect(() => {
    if (room) {
      room.removeAllListeners(RoomEvent.DataReceived);
      room.on(RoomEvent.DataReceived, (payload, participant) => {
        const decoder = new TextDecoder();
        if (editing === participant.identity) {
          const str = decoder.decode(payload);
          const obj = JSON.parse(str);
          console.log(obj);
          const targetLayout = {
            ...VideoLayouts[
              Object.keys(VideoLayouts).find(
                (key) => key === obj.current_layout.type
              )
            ],
          };
          var layout = targetLayout;
          console.log(targetLayout);
          layout.type = obj.current_layout.type;
          layout.slots = targetLayout.slots.map((slot, i) => {
            let _slot = { ...slot };
            _slot.track = obj.current_layout.slots[i].track || "";
            return _slot;
          });
          setPreviewLayout(layout);
        }
      });
    }
  }, [room, editing]);

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
          .filter((p) => p.metadata === "CHILD")
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
                  {videoTrack ? (
                    <VideoFrame
                      track={videoTrackRefsState[videoTrack]}
                      key={videoTrack}
                    />
                  ) : (
                    <></>
                  )}
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
        <div>
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
          console.log(e.target.value);
        }}
      >
        <option value="">--</option>
        {Object.keys(availableVideos).map((key) => {
          return (
            <option key={key} value={key}>
              {key}
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
        width: 150px;

        > div {
          width: 100%;
          height: 0;
          box-sizing: border-box;
          padding-top: 55%;
          position: relative;

          video {
            width: 100%;
            height: 100%;
            position: absolute;
            object-fit: contain;
            top: 0;
            background: #000;
          }
        }
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
