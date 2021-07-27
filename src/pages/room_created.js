import styled from "styled-components";
import Button from "../components/button";

const StyledPage = styled.div`
  div.roomCreated {
    text-align: center;
    font-size: 1.5rem;
    margin-top: 10%;
  }

  Button {
    position: absolute;
    top: 300px;
    left: 50%;
    transform: translate(-50%, 0);
    height: 100px;
    width: 200px;
  }
`;

export default function RoomCreated({ resetClick }) {
  return (
    <StyledPage>
      <div className="roomCreated">
        <h3>Room Created</h3>
      </div>

      <Button onClick={resetClick}>Back</Button>
    </StyledPage>
  );
}
