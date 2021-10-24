import styled from "styled-components";
import NoChildNodes from "./no-child-nodes";
import StreamControlCard from "./stream-control-card";

export default function StreamEditor({
  room,
  context,
  send,
  participants /* filtered child participants only */,
}) {
  return (
    <GridContainer>
      {participants.length === 0 ? (
        <NoChildNodes />
      ) : (
        <Grid>
          {participants
            .sort((a, b) => (a.sid > b.sid ? -1 : 1))
            .map((p) => (
              <StreamControlCard
                room={room}
                participant={p}
                key={p.sid}
                context={context}
                send={send}
              />
            ))}
        </Grid>
      )}
    </GridContainer>
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
  padding: 16px 0;
`;
