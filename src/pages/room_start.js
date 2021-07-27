import styled from "styled-components";
import Button from "../components/button";

const StyledPage = styled.div`
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;

  div.rooms {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
  }

  div.roomButton {
    transform: translate(0, -50%);
    text-align: center;
    border: 1px solid black;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 25px;
    margin: 25px;
    cursor: pointer;
    border-radius: 8px;
    box-shadow: 0 5px black;
    font-size: 1.5rem;
    height: 25%;
    width: 15%;

    &:hover {
      background: #ddd;
    }
  }

  Button {
    display: block;
    margin: auto;
  }
`;

export default function RoomStart({ newRoomClick, joinRoomClick }) {
  return (
    <StyledPage>
      <div className="rooms">
        <div className="roomButton" onClick={newRoomClick}>
          New Room
        </div>

        <div className="roomButton" onClick={joinRoomClick}>
          Join Room
        </div>
      </div>
    </StyledPage>
  );
}
