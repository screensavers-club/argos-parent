import axios from "axios";
import { useState } from "react";
import { DataPacket_Kind } from "livekit-client";
import styled from "styled-components";
import LayoutParticipantSelector from "./layout-participant-selector";
import ParticipantLayoutEditor from "./layout-participant-editor";
import { useEffect } from "react";

export default function LayoutEditorMain({
  room,
  send,
  context,
  participants,
  activeLayoutPending,
}) {
  const [activeLayout, setActiveLayout] = useState(false);

  useEffect(() => {
    send("SET_EDITING_LAYOUT", null);
  }, []);

  useEffect(() => {
    setActiveLayout(false);
  }, [activeLayoutPending]);

  function sendLayout(sid) {
    if (room) {
      const payload = JSON.stringify({
        action: "LAYOUT",
      });
      const encoder = new TextEncoder();
      const data = encoder.encode(payload);
      const targetSid = sid;

      room.localParticipant.publishData(data, DataPacket_Kind.RELIABLE, [
        targetSid,
      ]);
    }
  }

  function getLayoutState(room, nickname) {
    return axios.get(
      `${process.env.REACT_APP_PEER_SERVER}/${room}/${nickname}/layout`
    );
  }

  function setLayoutState(room, nickname, layout) {
    return axios
      .post(`${process.env.REACT_APP_PEER_SERVER}/${room}/${nickname}/layout`, {
        layout,
      })
      .then(() => {
        let participant = participants.find(
          (p) => JSON.parse(p.metadata || "{}")?.nickname === nickname
        );
        if (participant) {
          sendLayout(participant.sid);
        }
        return getLayoutState(room, nickname);
      });
  }

  return (
    <Wrapper>
      <div className="participants-selector">
        <h4>Control</h4>
        {participants
          .sort((a, b) => {
            return a.sid > b.sid ? -1 : 1;
          })
          .map((p) => (
            <LayoutParticipantSelector
              key={p.sid}
              participant={p}
              send={send}
              room={room}
              active={context.editing_layout === p.sid}
              setLayoutState={setLayoutState}
              getLayoutState={getLayoutState}
              setActiveLayout={setActiveLayout}
            />
          ))}
      </div>

      <ParticipantLayoutEditor
        context={context}
        send={send}
        room={room}
        activeLayout={activeLayout}
        participants={participants}
        setLayoutState={setLayoutState}
        getLayoutState={getLayoutState}
        setActiveLayout={setActiveLayout}
      />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  background: #2e2e35;
  width: 100%;
  height: calc(100% - 82px);
  border-radius: 15px;
  display: grid;
  grid-template-columns: 2fr 2fr 8fr;
  box-sizing: border-box;
  color: #fff;
  font-size: 1rem;
  overflow: hidden;

  .participants-selector {
    background: #33333f;

    h4 {
      text-align: center;
      font-size: 0.75rem;
      font-weight: normal;
      line-height: 1;
      margin: 2em 0 0.5em 0;
      text-transform: uppercase;
    }
  }
`;
