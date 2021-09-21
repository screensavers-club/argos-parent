import { useEffect, useState } from "react";
import styled from "styled-components";
import { DataPacket_Kind, RoomEvent } from "livekit-client";

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

export default function CueMix({ room, audioTracks, participants }) {
  let [cueMixState, setCueMixState] = useState({});

  useEffect(() => {
    participants.forEach((p) => triggerGetCueMixState(room, p));
  }, [participants]);

  useEffect(() => {
    room.on(RoomEvent.DataReceived, (payload, participant) => {
      const decoder = new TextDecoder();
      const str = decoder.decode(payload);
      const obj = JSON.parse(str);
      if (participant.identity) {
        let _cueMixState = { ...cueMixState };
        _cueMixState[participant.identity] = obj.cue_mix_state;
        setCueMixState(_cueMixState);
      }
    });

    return () => {
      room.removeAllListeners(RoomEvent.DataReceived);
    };
  }, []);

  return (
    <Grid>
      {participants
        .filter((p) => JSON.parse(p?.metadata || "{}").type === "CHILD")
        .map((p) => {
          let nickname = JSON.parse(p?.metadata || "{}").nickname;
          return (
            <MixTrack key={p.identity}>
              <span className="name">{nickname}</span>
              <div className="slots">
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
                    const _state = cueMixState[p?.identity];

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

                {(() => {
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
                })()}
              </div>
            </MixTrack>
          );
        })}
    </Grid>
  );
}

const MixTrack = styled.div`
  border: 1px solid #000;
  display: flex;
  padding: 5px 8px;
  border-radius: 4px;
  align-items: center;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);

  span.name {
    width: 6em;
    font-weight: 600;
  }

  .slots {
    display: grid;
    flex-grow: 1;
    grid-template-columns: repeat(4, 1fr);
    gap: 2px;
    cursor: pointer;

    .slot {
      display: flex;
      align-items: center;
      border: 1px solid #000;
      padding: 8px;
      max-width: 100%;

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
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 20px;
  gap: 20px;
`;
