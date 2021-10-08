import styled from "styled-components";
import axios from "axios";
import { User, Plus } from "react-ikonate";
import Card from "../components/cards";
import { useEffect } from "react";

const StyledPage = styled.div`
  background: #252529;
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

export default function RoomStartScreen({ send, context }) {
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_PEER_SERVER}/rooms/`)
      .then((result) => {
        return send("RETRIEVE_ROOMS", { rooms_available: result.data });
      })
      .catch((err) => {
        console.log(err.response);
      });
  }, []);

  let colors = {
    "#FD3832": [
      "apple",
      "plum",
      "date",
      "berry",
      "wolfberry",
      "peach",
      "tomato",
    ],
    "#C5F321": [
      "lime",
      "pear",
      "watermelon",
      "kiwi",
      "melon",
      "honeydew",
      "olive",
    ],
    "#F9EEA0": ["lychee", "guava", "melon", "banana", "quince"],
    "#FCAB1D": [
      "orange",
      "mango",
      "apricot",
      "persimmon",
      "kumquat",
      "papaya",
      "loquat",
      "pineapple",
      "longan",
      "jackfruit",
    ],
    "#5D0AEA": ["grape", "fig", "prune"],
  };

  return (
    <StyledPage>
      <div className="rooms">
        <Card
          variant="create"
          icon={<Plus />}
          gradient={`linear-gradient(135deg, #434349, #252529)`}
          onClick={() => {
            send("CREATE_ROOM");
          }}
        >
          Create room
        </Card>
        {context.rooms_available.map(function ({ name }, i) {
          const fruits = name.split("-");
          const colorPair = fruits.map((fruit) => {
            let key = `key${i}`;

            return Object.keys(colors).find((hex) => {
              return colors[hex].indexOf(fruit) > -1;
            });
          });

          let key = `key_${i}`;

          return (
            <Card
              key={key}
              participants="5 / 10"
              icon={<User />}
              gradient={`linear-gradient(135deg, ${colorPair[0]}, ${colorPair[1]})`}
              onClick={() => {
                send("ROOM_SELECTED", { room: name });
              }}
            >
              {name}
            </Card>
          );
        })}
      </div>
    </StyledPage>
  );
}
