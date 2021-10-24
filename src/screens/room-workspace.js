import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import Button from "../components/button";
import { useRoom } from "livekit-react";
import StreamTabs from "../components/stream-tabs";
import MixerPage from "../components/mixer-page";
import CueMix from "../components/cue-mix-panel";
import VideoLayouts from "../util/video-layouts";
import { DataPacket_Kind, RoomEvent } from "livekit-client";
import { User as UserIcon, Exit, Link, Copy, Stopwatch } from "react-ikonate";
import axios from "axios";

const StyledPage = styled.div`
  background: #191920;
  position: relative;
  display: block;
  padding: 16px;

  div.navigation {
    display: flex;
  }

  div.streamLinks {
    grid-column: 2 / span 3;
    grid-row: 5 / span 1;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 15px;
    box-sizing: border-box;

    > div.buttons {
      display: flex;
      align-items: center;

      button {
        margin: 0 5px;
      }
    }

    label {
      font-size: 16px;
      display: flex;
      align-items: center;
      svg {
        font-size: 18px;
        stroke-width: 1.5px;
        color: white;
        padding-right: 10px;
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
  div.controlPanel {
    display: block;
    margin: auto;
    padding: auto;
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
export default function RoomWorkspace({ context, send, parents }) {
  const { room, connect, participants, audioTracks } = useRoom();
  const [selectTab, setSelectTab] = useState("stream-controls");
  const [renderState, setRenderState] = useState(0);
  let [exiting, setExiting] = useState(false);
  const exitingModalRef = useRef();
  const audioCtx = useRef(new AudioContext());
  const msDestination = useRef(null);
  const audioTrackRefs = useRef({});
  const [audioTrackRefsState, setAudioTrackRefsState] = useState(
    audioTrackRefs.current
  );
  const videoTrackRefs = useRef({});
  const [videoTrackRefsState, setVideoTrackRefsState] = useState(
    videoTrackRefs.current
  );
  useEffect(() => {
    //create mediaStreamDestination
    msDestination.current = audioCtx.current.createMediaStreamDestination();

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keyup", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keyup", handleEsc);
    };
  }, []);
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
    let __tracks = [];
    audioTracks.forEach((audioTrack) => {
      if (__tracks.indexOf(audioTrack.sid) < 0 && audioTrack.mediaStreamTrack) {
        __tracks.push(audioTrack.sid);
        let mst = audioCtx.current.createMediaStreamTrackSource(
          audioTrack.mediaStreamTrack
        );
        let gainNode = new GainNode(audioCtx.current, { gain: 1 });
        let channelSplitterNode = new ChannelSplitterNode(audioCtx.current, {
          numberOfOutputs: 2,
        });
        audioTrackRefs.current[audioTrack.sid] = {
          mediaStreamTrackSource: mst,
          gainNode: gainNode,
          splitter: channelSplitterNode,
        };
        mst
          .connect(gainNode)
          .connect(channelSplitterNode)
          .connect(audioCtx.current.destination);
        channelSplitterNode.connect(msDestination.current);
      }
    });

    Object.keys(audioTrackRefs.current).forEach((key) => {
      if (__tracks.indexOf(key) < 0) {
        audioTrackRefs.current[key].mediaStreamTrackSource.disconnect();
        audioTrackRefs.current[key].gainNode.disconnect();
        audioTrackRefs.current[key].splitter.disconnect();
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
          nickname: JSON.parse(participant.metadata).nickname,
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
        let track = msDestination.current?.stream?.getTracks();
        if (track[0]) {
          room.localParticipant.publishTrack(track[0]);
        }
      })
      .catch((err) => console.log({ err }));
    return () => {
      room?.disconnect();
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

  function sendPing(id) {
    if (room) {
      const payload = JSON.stringify({
        action: "PING",
      });
      const encoder = new TextEncoder();
      const data = encoder.encode(payload);
      const targetSid = id;

      let d = new Date();
      send("PING", { id, timestamp: d });
      room.localParticipant.publishData(data, DataPacket_Kind.RELIABLE, [
        targetSid,
      ]);
    }
  }

  function setDelay({ id, delay, room }) {
    axios
      .post(
        `${process.env.REACT_APP_PEER_SERVER}/parent/participant/set-delay`,
        { id, delay, room }
      )
      .catch((err) => console.log(err));
  }
  let [expanded, setExpanded] = useState(false);

  return (
    <StyledPage>
      <div className="navigation">
        <StreamTabs setSelectTab={setSelectTab} selectedTab={selectTab} />

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

      {(function () {
        switch (selectTab) {
          case "stream-controls":
            return (
              <MainControlView>
                <div className="children">
                  {participants
                    .filter(
                      (p) => JSON.parse(p?.metadata || "{}")?.type === "CHILD"
                    )
                    .map((p, i) => {
                      const key = p.identity;
                      const nickname = JSON.parse(
                        p?.metadata || "{}"
                      )?.nickname;
                      return (
                        <div key={key} className="child">
                          <div className="leftPanel">
                            <span className="heading">
                              <UserIcon /> {nickname} (
                              <UserPing
                                ping={context?.ping?.[p.sid]}
                                sendPing={() => {
                                  sendPing(p.sid);
                                }}
                              />
                              )
                            </span>

                            <div>
                              <div
                                className={`delayDiv ${
                                  expanded === true ? "expanded" : ""
                                }`}
                              >
                                <span
                                  onClick={() => {
                                    expanded === true
                                      ? setExpanded(false)
                                      : setExpanded(true);
                                  }}
                                >
                                  <Stopwatch /> Ref audio delay
                                </span>
                                <input
                                  type="text"
                                  value={`${
                                    JSON.parse(p.metadata)?.audio_delay || 0
                                  }ms`}
                                  id={`audio_delay_${key}`}
                                />
                                <Button
                                  variant="delay"
                                  type="tertiary"
                                  onClick={() => {
                                    let _delay = parseInt(
                                      document.getElementById(
                                        `audio_delay_${key}`
                                      ).value
                                    );
                                    setDelay({
                                      id: p.identity,
                                      delay: _delay,
                                      room: room.name,
                                    });
                                  }}
                                >
                                  Update
                                </Button>
                              </div>
                            </div>
                          </div>
                          <CueMix
                            ownerNick={nickname}
                            context={context}
                            send={send}
                            room={room}
                            audioTracks={audioTracks}
                            participants={participants}
                          />
                          <div className="streamLinks">
                            <label>
                              <Link />
                              Copy stream links
                            </label>
                            <div className="buttons">
                              <div className="stream_code">
                                <Button
                                  variant="small"
                                  icon={<Copy />}
                                  onClick={() => {
                                    let input = document.querySelector(
                                      `#${`stream_url_${key}`}`
                                    );
                                    input.select();
                                    document.execCommand("copy");
                                  }}
                                >
                                  Video only
                                </Button>
                                <input
                                  type="text"
                                  style={{
                                    position: "absolute",
                                    top: "-100000px",
                                  }}
                                  id={`stream_url_${key}`}
                                  value={`${process.env.REACT_APP_VIEWER_BASE_URL}?room=${context.room.name}&passcode=${context.passcode}&target=${p.identity}`}
                                  readOnly
                                />
                              </div>
                              <div className="stream_code">
                                <Button
                                  variant="small"
                                  icon={<Copy />}
                                  onClick={() => {
                                    let input = document.querySelector(
                                      `#${`stream_url_a_${key}`}`
                                    );
                                    input.select();
                                    document.execCommand("copy");
                                  }}
                                >
                                  Video + audio
                                </Button>
                                <input
                                  type="text"
                                  style={{
                                    position: "absolute",
                                    top: "-100000px",
                                  }}
                                  id={`stream_url_a_${key}`}
                                  value={`${process.env.REACT_APP_VIEWER_BASE_URL}?room=${context.room.name}&passcode=${context.passcode}&target=${p.identity}&audio=1`}
                                  readOnly
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  {/* <div className="parent">
                    <span className="name">
                      <UserIcon /> PARENT
                      <AveragePing
                        pings={context.ping}
                        participants={participants}
                      />
                    </span>
                    <div className="stream_code">
                      <label>Parent Audio Mix</label>
                      <input
                        type="text"
                        style={{
                          position: "absolute",
                          top: "-100000px",
                        }}
                        id={`stream_url_${context.identity}`}
                        value={`${process.env.REACT_APP_VIEWER_BASE_URL}?room=${context.room.name}&passcode=${context.passcode}&target=${context.identity}&audio=1`}
                        readOnly
                      />
                      <button
                        type="button"
                        onClick={() => {
                          let input = document.querySelector(
                            `#${`stream_url_${context.identity}`}`
                          );
                          input.select();
                          document.execCommand("copy");
                        }}
                      >
                        Copy
                      </button>
                    </div>
                  </div> */}
                </div>
              </MainControlView>
            );
          case "monitor-layout":
            return (
              <VideoLayoutEditor
                room={room}
                participants={participants}
                videoTrackRefsState={videoTrackRefsState}
              />
            );
          case "audio-mixer":
            return (
              <div>
                <div style={{ display: "flex" }}>
                  <input
                    type="text"
                    id={`stream_url_${context.identity}`}
                    value={`${process.env.REACT_APP_VIEWER_BASE_URL}?room=${context.room.name}&passcode=${context.passcode}&target=${context.identity}`}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      // let input = document.querySelector(
                      //   `#${`stream_url_${key}`}`
                      // );
                      // input.select();
                      // document.execCommand("copy");
                    }}
                  >
                    Copy
                  </button>
                  <button type="button" onClick={() => {}}>
                    Test
                  </button>
                </div>
                <MixerPage
                  control={control}
                  setControl={setControl}
                  master={context.master}
                />
              </div>
            );

          case "cue-mix":
            return (
              <CueMix
                context={context}
                send={send}
                room={room}
                audioTracks={audioTracks}
                participants={participants}
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

const MainControlView = styled.div`
  width: 100%;
  height: 100vh;
  overflow-y: scroll;

  .children {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 20px;
    padding: 16px 0;

    .child,
    .parent {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      grid-template-rows: repeat(5, 1fr);
      gap: 5px;
      position: relative;
      color: white;
      padding: 8px;
      box-sizing: border-box;
      border-radius: 15px;
      width: 100%;
      height: 260px;
      background: #343439;

      div.leftPanel {
        grid-column: 1 / span 1;
        grid-row: 1 / span 5;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        box-sizing: border-box;
        padding: 5px;
      }

      div.delayDiv {
        display: flex;
        flex-direction: column;
        background: #5736fd;
        width: 140px;
        height: 20px;
        border-radius: 25px;
        display: flex;
        justify-content: center;
        align-items: center;

        font-size: 12px;
        padding: 15px 5px;
        margin-bottom: 80px;

        :hover {
          cursor: pointer;
        }

        span {
          display: flex;
          align-items: center;
          width: 100%;
          text-align: center;
          svg {
            font-size: 12px;
            stroke-width: 1.5px;
            padding-right: 5px;
          }
        }

        input {
          display: none;
          height: 35px;
          border-radius: 50px;
          width: 88px;
          background: none;
          border: 1px solid white;
          outline: none;
          margin-bottom: 5px;
          color: white;
          align-items: center;
        }

        button {
          display: none;
        }
      }
      div.expanded {
        height: 100px;
        margin-bottom: 0;

        span {
          margin-bottom: 10px;
        }

        input,
        button {
          align-items: center;
          display: flex;
          text-align: center;
        }
      }

      span.heading {
        display: flex;
        align-items: center;
        font-weight: 600;

        svg {
          font-size: 24px;
          margin-right: 10px;
        }
      }

      .stream_code {
        display: flex;

        label {
          width: 50%;
          font-size: 12px;
        }
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
          if (!obj?.current_layout) {
            return;
          }
          const targetLayout = {
            ...VideoLayouts[
              Object.keys(VideoLayouts).find(
                (key) => key === obj.current_layout.type
              )
            ],
          };
          if (targetLayout === {}) {
            return;
          }
          var layout = targetLayout;
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

function UserPing({ sendPing, ping }) {
  useEffect(() => {
    const intervalId = window.setInterval(sendPing, 2000);
    return () => {
      window.clearInterval(intervalId);
    };
  }, []);
  if (ping?.length === 2 && ping[1] - ping[0] > 0) {
    return <span style={{ fontSize: ".6em" }}>{(ping[1] - ping[0]) / 2}</span>;
  }
  return <>...</>;
}

function AveragePing({ pings, participants }) {
  return (
    <span style={{ fontSize: ".6em" }}>
      (AVE{" "}
      {Math.floor(
        participants
          .filter((p) => JSON.parse(p.metadata || "{}").type === "CHILD")
          .map((p) => pings?.[p.sid])
          .reduce((p, c, i, a) => {
            return p + ((c?.[1] || 0) - (c?.[0] || 0)) / a.length / 2;
          }, 0)
      )}
      )
    </span>
  );
}
