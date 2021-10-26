import styled from "styled-components";
import NoChildNodes from "../no-child-nodes";
import StreamControlCard from "./stream-control-card";
import MixPresetsControl from "./mix-presets";
import { useState } from "react";

export default function StreamEditor({
  room,
  context,
  send,
  updateMix,
  participants /* filtered child participants only */,
}) {
  const [bumpMix, setBumpMix] = useState(0);
  return participants.length === 0 ? (
    <NoChildNodes />
  ) : (
    <>
      <GridContainer>
        <Grid>
          <StreamControlCard
            room={room}
            participant={room.localParticipant}
            context={context}
            send={send}
            updateMix={updateMix}
            parent
            bumpMix={bumpMix}
          />
          {participants
            .sort((a, b) => (a.sid > b.sid ? -1 : 1))
            .map((p) => (
              <StreamControlCard
                room={room}
                participant={p}
                key={p.sid}
                context={context}
                send={send}
                bumpMix={bumpMix}
              />
            ))}
        </Grid>
      </GridContainer>
      <MixPresetsControl
        room={room}
        updateMix={() => {
          updateMix();
          setBumpMix(bumpMix > 5 ? 0 : bumpMix + 1);
        }}
      />
    </>
  );
}

const GridContainer = styled.section`
  display: block;
  position: absolute;
  top: 82px;
  bottom: 16px;
  width: calc(100% - 32px);
  overflow-y: scroll;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 20px;
  padding: 16px 0 82px 0;
`;
