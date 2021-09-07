import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import Button from "../components/button";
import { useRoom } from "livekit-react";
import StreamTabs from "../components/stream-tabs";
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
  const { room, connect, participants, audioTracks } = useRoom();
  const [selectTab, setSelectTab] = useState("stream");
  const [renderState, setRenderState] = useState(0);

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
  let [activeControl, setActiveControl] = useState(0);

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
                          <div style={{ border: "1px solid #fcf" }}>
                            {participant.identity}
                            <br />
                            {firstAudioTrack?.trackSid}
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
                    {Object.keys(videoTrackRefsState).map((key) => {
                      if (!videoTrackRefsState[key]?.videoTrack?.track) {
                        return false;
                      }
                      return (
                        <VideoFrame
                          track={videoTrackRefsState[key]}
                          key={key}
                        />
                      );
                    })}
                  </div>
                </MainControlView>
              </>
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
      <TogglePerformers
        control={control}
        activeControl={activeControl}
        setActiveControl={setActiveControl}
      />
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
    track.videoTrack?.track?.attach(el);
    return () => {
      track.videoTrack?.track?.detach(el);
    };
  });
  return (
    <div>
      <video ref={ref} muted autoPlay />
    </div>
  );
}

const MainControlView = styled.div`
  width: 100%;
  height: 100vh;
  display: grid;
  grid-template-columns: 15% 70% 15%;
`;
