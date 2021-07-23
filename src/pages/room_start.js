import styled from "styled-components";
import Button from "../components/button";

const StyledPage = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;

  div.roomButton {
    text-align: center;
    border: 1px solid black;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: auto;
    padding: 25px;
    margin: 25px;
    cursor: pointer;
    border-radius: 8px;
    box-shadow: 0 5px black;
    font-size: 1.5rem;

    &:hover {
      background: #ddd;
    }
  }

  Button {
    position: absolute;
    top: 300px;
    left: 50%;
    transform: translate(-50%, 0);
  }
`;

export default function RoomStart({
  newRoomClick,
  joinRoomClick,
  buttonClick,
}) {
  return (
    <StyledPage>
      <div className="roomButton" onClick={newRoomClick}>
        New Room
      </div>

      <div className="roomButton" onClick={joinRoomClick}>
        Join Room
      </div>

      <Button onClick={buttonClick}>Send Reset</Button>
    </StyledPage>
  );
}
