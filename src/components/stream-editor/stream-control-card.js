import styled from "styled-components";
import { DataPacket_Kind } from "livekit-client";
import { useParticipant } from "livekit-react";
import {
  User,
  Microphone,
  Film,
  Music,
  VolumeLoud,
  VolumeOff,
  Link,
  Alarm,
} from "react-ikonate";
import axios from "axios";
import { useState, useEffect } from "react";
import { useRef } from "react";

export default function StreamControlCard({
  room,
  participant,
  context,
  send,
  parent,
  updateMix,
}) {
  let pingTimeoutRef = useRef();
  let { metadata, publications } = useParticipant(participant);
  let nickname = parent ? "PARENT" : JSON.parse(metadata || "{}").nickname;
  let hasAudio = publications.find((pub) => pub.kind === "audio");
  let hasVideo = publications.find((pub) => pub.kind === "video");

  let pingPair = context.ping?.[participant.sid] || [];
  let ping = "";

  if (!parent) {
    ping = pingPair[1] > pingPair[0] ? pingPair[1] - pingPair[0] : "…";
  }

  let [mixState, setMixState] = useState(null);
  let [sendingMix, setSendingMix] = useState(false);

  function getMixState(roomName, nickname) {
    return axios.get(
      `${process.env.REACT_APP_PEER_SERVER}/${roomName}/${nickname}/mix`
    );
  }

  function sendMixState(roomName, nickname, mix) {
    return axios
      .post(
        `${process.env.REACT_APP_PEER_SERVER}/${roomName}/${nickname}/mix`,
        { mix }
      )
      .then((result) => {
        if (parent) {
          if (typeof updateMix === "function") {
            updateMix();
          }
        } else {
          sendMixPing(participant.sid);
        }
        return result;
      });
  }

  function sendPing(sid) {
    if (room) {
      const payload = JSON.stringify({
        action: "PING",
      });
      const encoder = new TextEncoder();
      const data = encoder.encode(payload);
      const targetSid = sid;

      let d = new Date();
      send("PING", { id: sid, timestamp: d });
      room.localParticipant.publishData(data, DataPacket_Kind.RELIABLE, [
        targetSid,
      ]);
    }
  }

  function sendMixPing(sid) {
    if (room) {
      const payload = JSON.stringify({
        action: "MIX",
      });
      const encoder = new TextEncoder();
      const data = encoder.encode(payload);

      room.localParticipant.publishData(data, DataPacket_Kind.RELIABLE, [sid]);
    }
  }

  useEffect(() => {
    if (!nickname) {
      return;
    }
    getMixState(room.name, nickname).then((result) => {
      if (result.data?.mix === null) {
        sendMixState(room.name, nickname, {
          mute: [],
          delay: 0,
        }).then((result) => {
          setMixState(result.data.mix);
        });
      } else {
        setMixState(result.data.mix);
      }
    });
  }, [nickname]);

  useEffect(() => {
    if (pingTimeoutRef) {
      window.clearInterval(pingTimeoutRef);
    }
    pingTimeoutRef = window.setInterval(() => {
      sendPing(participant.sid);
    }, 5000);

    return () => {
      window.clearInterval(pingTimeoutRef);
    };
  }, []);

  if (!metadata || !mixState?.mute) {
    return false;
  }

  return (
    <Card className={parent ? "parent" : "child"}>
      <div className="top">
        <label className="nickname">
          <User strokeWidth={0.8} />
          {parent ? "PARENT" : nickname} <span className="ping">{ping}</span>
        </label>
        <div className="av-status">
          <Microphone className={hasAudio ? "active" : "inactive"} />
          <Film className={hasVideo ? "active" : "inactive"} />
        </div>
      </div>

      <div className="mix">
        <div className="tiles">
          {context.participants
            .filter(
              (p) =>
                p.metadata &&
                JSON.parse(p.metadata).type === "CHILD" &&
                participant.sid !== p.sid
            )
            .sort((a, b) => (a.sid > b.sid ? -1 : 1))
            .map((p) => {
              p.nickname = JSON.parse(p.metadata).nickname;
              return (
                <CueMixTile
                  key={p.sid}
                  status={false}
                  peer={p}
                  mute={mixState.mute.indexOf(p.nickname) > -1}
                  onClick={() => {
                    if (sendingMix) {
                      return;
                    }
                    setSendingMix(true);
                    let newMixState = { ...mixState };
                    if (mixState.mute.indexOf(p.nickname) > -1) {
                      // unmute this
                      newMixState.mute = mixState.mute.filter(
                        (nickname) => nickname !== p.nickname
                      );
                    } else {
                      // mute this
                      newMixState.mute.push(p.nickname);
                    }
                    sendMixState(room.name, nickname, newMixState).then(
                      (result) => {
                        setSendingMix(false);
                        setMixState(result.data.mix);
                      }
                    );
                  }}
                />
              );
            })}
        </div>
      </div>

      <div className="bottom">
        <div className="stream-links">
          <h4>
            <Link /> Click to copy stream link
          </h4>
          <button
            onClick={() => {
              let input = document.querySelector(
                `#${`stream_url_${participant.sid}`}`
              );
              input.select();
              document.execCommand("copy");
            }}
          >
            <Film />
          </button>
          <button
            onClick={() => {
              let input = document.querySelector(
                `#${`stream_url_a_${participant.sid}`}`
              );
              input.select();
              document.execCommand("copy");
            }}
          >
            <Film /> + <VolumeLoud />
          </button>

          <input
            type="text"
            className="hidden"
            id={`stream_url_${participant.sid}`}
            value={`${process.env.REACT_APP_VIEWER_BASE_URL}?room=${context.room.name}&passcode=${context.passcode}&target=${participant.identity}`}
            readOnly
          />

          <input
            type="text"
            style={{
              position: "absolute",
              top: "-100000px",
            }}
            id={`stream_url_a_${participant.sid}`}
            value={`${process.env.REACT_APP_VIEWER_BASE_URL}?room=${context.room.name}&passcode=${context.passcode}&target=${participant.identity}&audio=1`}
            readOnly
          />
        </div>
        <div className="delay-control">
          <h4>
            <Alarm /> Output audio delay
          </h4>
          <input
            type="text"
            value={mixState.delay}
            className="current delay"
            disabled
          />
          <input
            type="text"
            className="desired delay"
            id={`desired_delay_${participant.sid}`}
          />
          <button
            onClick={() => {
              if (sendingMix) {
                return;
              }

              let delay = parseInt(
                document.getElementById(`desired_delay_${participant.sid}`)
                  .value
              );

              if (delay) {
                setSendingMix(true);
                let newMixState = { ...mixState };
                newMixState.delay = delay;

                sendMixState(room.name, nickname, newMixState).then(
                  (result) => {
                    setSendingMix(false);
                    setMixState(result.data.mix);

                    document.getElementById(
                      `desired_delay_${participant.sid}`
                    ).value = "";
                  }
                );
              }
            }}
          >
            Set
          </button>
        </div>
      </div>
    </Card>
  );
}

const Card = styled.div`
  position: relative;
  color: white;
  padding: 8px;
  box-sizing: border-box;
  border-radius: 16px;
  width: 100%;
  height: 260px;
  background: #343439;

  &.parent {
    border: 2px solid #aaaaae;
  }

  .top {
    width: 100%;
    height: 25px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #222225;
    padding: 0 0 8px 0;

    label.nickname {
      display: flex;
      align-items: center;
      font-weight: 300;
      font-size: 1rem;

      svg {
        font-size: 1.5em;
        margin-right: 10px;
      }

      span.ping {
        margin-left: 8px;
        font-size: 0.8em;
        color: #aaaaae;
      }
    }

    .av-status {
      font-size: 1.2rem;
      padding-top: 4px;

      > svg {
        margin-right: 8px;

        &.inactive {
          opacity: 0.3;
        }
      }
    }
  }

  .mix {
    padding: 8px 0;

    .tiles {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      grid-template-rows: repeat(3, 1fr);
      gap: 8px;
      height: 124px;
    }
  }

  .bottom {
    border-top: 1px solid #222225;
    padding-top: 12px;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;

    .delay-control,
    .stream-links {
      white-space: nowrap;
      overflow-x: hidden;

      h4 {
        margin: 0 0 8px 0;
        font-size: 0.7rem;
        text-transform: uppercase;
        font-weight: normal;
        display: flex;
        align-items: center;

        svg {
          font-size: 1.3em;
          margin: 0 8px 0 0;
        }
      }

      input.hidden {
        position: absolute;
        top: -100000px;
      }

      input,
      button {
        cursor: pointer;
        appearance: none;
        outline: none;
        background: #222225;
        color: #ffffff;
        border: 0;
        width: 6rem;
        height: 2rem;
        font-size: 1.3rem;
        border-radius: 8px;
        margin: 0 8px 0 0;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        text-align: center;

        &:hover {
          background: #27272d;
        }

        &.delay {
          width: 4rem;

          &.desired {
            color: #aaa;
            margin: 0;
            border-radius: 8px 0 0 8px;
            background: #2a2a31;
            border: 1px solid #222225;
            border-right: 0;

            & + button {
              border-radius: 0px 8px 8px 0;
              width: 4rem;
            }
          }
        }
      }
    }
  }

  &.parent {
    .bottom {
      display: none;
    }
  }
`;

function CueMixTile({ peer, mute, onClick }) {
  let meta;

  try {
    meta = JSON.parse(peer.metadata);
  } catch (err) {
    console.log(err);
  }

  if (peer.audioTracks.size < 1 || !meta) {
    return false;
  }
  return (
    <Tile mute={mute} onClick={onClick}>
      <b className="indicator">{mute ? <VolumeOff /> : <VolumeLoud />}</b>{" "}
      {meta.nickname}
    </Tile>
  );
}

const Tile = styled.div`
  color: white;
  background: #222225;
  padding: 8px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background: #232326;
  }

  b.indicator {
    width: 20px;
    height: 20px;
    display: block;
    /* background-color: ${(p) => (p.mute ? "gray" : "#e1ff68")}; */
    color: ${(p) => (p.mute ? "gray" : "#e1ff68")};
    font-size: 1.2rem;
    margin: 0 8px 0 0;
  }
`;
