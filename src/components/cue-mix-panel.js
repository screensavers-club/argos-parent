import { useEffect, useState } from "react";
import styled from "styled-components";
import { DataPacket_Kind, RoomEvent } from "livekit-client";
import { Music } from "react-ikonate";

function triggerGetCueMixState(room, participant) {
  const payload = JSON.stringify({ action: "GET_CUE_MIX_STATE" });
  const encoder = new TextEncoder();
  const data = encoder.encode(payload);
  const targetSid = participant.sid;

  room.localParticipant.publishData(data, DataPacket_Kind.RELIABLE, [
    targetSid,
  ]);
}

function sendToggleMuteTrack(room, participant, owner) {
  const payload = JSON.stringify({
    action: "TOGGLE_CUE_MIX_TRACK",
    target: owner.identity,
    mode: "peers",
  });
  const encoder = new TextEncoder();
  const data = encoder.encode(payload);
  const targetSid = participant.sid;

  room.localParticipant.publishData(data, DataPacket_Kind.RELIABLE, [
    targetSid,
  ]);
}

function sendToggleParentTrack(room, participant, owner) {
  const payload = JSON.stringify({
    action: "TOGGLE_CUE_MIX_TRACK",
    target: owner.identity,
    mode: "parent",
  });
  const encoder = new TextEncoder();
  const data = encoder.encode(payload);
  const targetSid = participant.sid;

  room.localParticipant.publishData(data, DataPacket_Kind.RELIABLE, [
    targetSid,
  ]);
}

export default function CueMix({
  room,
  audioTracks,
  participants,
  send,
  context,
  ownerNick,
}) {
  let [cueMixState, setCueMixState] = useState({});

  //useEffect(() => {
  //  participants.forEach((p) => triggerGetCueMixState(room, p));
  //}, [participants]);

  useEffect(() => {
    room.on(RoomEvent.DataReceived, (payload, participant) => {
      const decoder = new TextDecoder();
      const str = decoder.decode(payload);
      const obj = JSON.parse(str);

      if (obj.cue_mix_state) {
        if (participant.identity) {
          let _cueMixState = { ...cueMixState };
          _cueMixState[participant.identity] = obj.cue_mix_state;
          setCueMixState(_cueMixState);
          send("UPDATE_CUE_MIX_STATE", {
            target: participant.identity,
            data: obj.cue_mix_state,
          });
        }
      }
    });

    return () => {
      room.removeAllListeners(RoomEvent.DataReceived);
    };
  }, []);

  return (
    <>
      {participants
        .filter((p) => JSON.parse(p?.metadata || "{}").type === "CHILD")
        .map((p) => {
          let nickname = JSON.parse(p?.metadata || "{}").nickname;
          if (nickname === ownerNick) {
            return (
              <MixTrack key={p.identity}>
                <span className="heading">
                  <Music />
                  Cue mix
                </span>
                {audioTracks
                  .map((track) => {
                    let owner = participants.find((p) => {
                      let isOwner = false;
                      p?.audioTracks?.forEach((_, sid) => {
                        if (sid === track.sid) {
                          isOwner = true;
                        }
                      });
                      return isOwner;
                    });
                    return { owner, track };
                  })
                  .filter(({ owner, track }) => {
                    return owner?.identity !== p.identity;
                  })
                  .map(({ owner, track }) => {
                    if (!owner) {
                      return <></>;
                    }
                    let isMuted = false;
                    const _state = context.cue_mix_state?.[p?.identity];

                    if (_state?.source === "parent") {
                      isMuted = true;
                    } else if (_state?.mute) {
                      if (_state.mute.indexOf(owner.identity) > -1) {
                        isMuted = true;
                      }
                    }

                    return (
                      <div
                        className="slot"
                        key={owner?.identity}
                        onClick={() => {
                          sendToggleMuteTrack(room, p, owner);
                        }}
                      >
                        <b className={`status${isMuted ? " muted" : ""}`} />{" "}
                        {JSON.parse(owner.metadata || "{}")?.nickname}
                      </div>
                    );
                  })}
                {/* {(() => {
          let isMuted = true;
          if (cueMixState[p?.identity]) {
            isMuted = cueMixState[p.identity].source !== "parent";
          }

          return (
            <div
              className="slot"
              key={room?.localParticipant?.identity}
              onClick={() => {
                sendToggleParentTrack(room, p, room?.localParticipant);
              }}
            >
              <b className={`status ${isMuted ? " muted" : ""}`} />{" "}
              [PMIX]
            </div>
          );
        })()} */}
              </MixTrack>
            );
          } else {
            return <></>;
          }
        })}
    </>
  );
}

const MixTrack = styled.div`
  grid-column: 2 / span 3;
  grid-row: 1 / span 4;

  padding: 5px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(5, 1fr);
  row-gap: 20px;
  column-gap: 5px;
  width: 100%;
  background: #434349;
  box-sizing: border-box;
  border-radius: 8px;

  span.heading {
    grid-column: 1 / span 4;
    grid-row: 1 / span 1;
  }

  .slot {
    display: flex;
    align-items: center;
    width: 100%;
    border-radius: 50px;
    padding: 8px;
    flex-grow: 1;
    cursor: pointer;
    background: #fff;
    color: #434349;
    box-sizing: border-box;

    &:hover {
      background: #eee;
    }

    b.status {
      width: 15px;
      height: 15px;
      background: green;
      display: block;
      margin: 2px;
      margin-right: 8px;
      border-radius: 8px;

      &.muted {
        background: #ccc;
      }
    }
  }
`;
