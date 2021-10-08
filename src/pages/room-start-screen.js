import styled from "styled-components";
import Button from "../components/button";
import axios from "axios";
import { New, Entrance } from "react-ikonate";
import Card from "../components/cards";

const StyledPage = styled.div`
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
  font-family: "Noto Sans", sans-serif;

  div.rooms {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
  }

  button {
    margin: 0 1em;
  }
`;

export default function RoomStartScreen({ send }) {
  return (
    <StyledPage>
      <div className="rooms">
        <Card
          onClick={() => {
            send("CREATE_ROOM");
          }}
          icon={<New />}
        >
          Create Room
        </Card>

        <Card
          onClick={() => {
            send("JOIN_ROOM");
          }}
          icon={<Entrance />}
        >
          Join Room
        </Card>
      </div>
    </StyledPage>
  );
}
