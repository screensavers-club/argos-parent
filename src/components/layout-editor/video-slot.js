import { useParticipant } from "livekit-react";
import { useRef } from "react";
import styled from "styled-components";
import VideoParticipant from "./video-participant";

export default function VideoSlot({
  nickname,
  participants,
  activeLayout,
  setSlot,
}) {
  let selectRef = useRef();
  let activeParticipant = participants.find((p) => {
    let _nick = JSON.parse(p.metadata || "{}")?.nickname;
    if (_nick) {
      return _nick === nickname;
    }
    return false;
  });

  return (
    <Slot>
      {activeParticipant && (
        <VideoParticipant participant={activeParticipant} />
      )}
      <Selection>
        {nickname || "NONE"}
        <select
          ref={selectRef}
          value={nickname}
          onChange={(e) => {
            setSlot(e.target.value);
          }}
        >
          <option value="NONE">--</option>
          {participants.map((p, i) => {
            let n = JSON.parse(p.metadata || "{}")?.nickname;
            return (
              <Option
                participant={p}
                key={n || `slot_${i}`}
                curSelected={nickname}
              />
            );
          })}
        </select>
      </Selection>
    </Slot>
  );
}

function Option({ participant }) {
  const { metadata } = useParticipant(participant);
  if (!metadata) {
    return <></>;
  }
  const nickname = JSON.parse(metadata)?.nickname;
  if (!nickname) {
    return <></>;
  }
  return (
    <option
      // selected={curSelected === nickname}
      value={nickname}
    >
      {nickname}
    </option>
  );
}

const Slot = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;

  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Selection = styled.label`
  height: 1em;
  position: relative;
  border: 1px solid #fff;
  width: 4rem;
  position: absolute;
  bottom: 16px;
  right: 16px;
  font-size: 0.8rem;
  text-align: center;
  padding: 4px;
  border-radius: 4px;
  cursor: pointer;

  select {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: transparent;
    appearance: none;
    outline: none;
    border: 0;
    text-indent: -10000em;
    cursor: pointer;
  }
`;
