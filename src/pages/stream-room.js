import { useEffect } from "react";
import styled from "styled-components";
import Button from "../components/button";
import { useRoom } from "livekit-react";

const StyledPage = styled.div``;

export default function StreamRoom({ state, context, send }) {
  const { room, connect } = useRoom();

  useEffect(() => {
    connect(`${process.env.REACT_APP_LIVEKIT_SERVER}`, context.token);
  });
  return (
    <StyledPage>
      <div className="streamTabs"></div>

      <Button
        onClick={() => {
          send("RESET");
        }}
      >
        Back
      </Button>
    </StyledPage>
  );
}
