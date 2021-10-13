import styled from "styled-components";
import axios from "axios";
import { User, Plus, Rotate } from "react-ikonate";
import Card from "../components/cards";
import { useEffect, useRef } from "react";

const StyledPage = styled.div`
  background: #252529;
  display: flex;
  flex-direction: column;
  height: 100%;
  align-items: center;
  justify-content: center;
  font-family: "Noto Sans", sans-serif;

  div.header {
    display: flex;
    color: white;
    margin-top: 50px;
    h3 {
      font-weight: 200;
      font-size: 36px;
    }

    svg.refreshButton {
      margin: auto 0 auto 50px;
      stroke-width: 1px;
      font-size: 42px;

      :hover {
        cursor: pointer;
      }
    }
    .animate_rotate {
      -webkit-animation: rotate 0.5s linear infinite;
      -moz-animation: rotate 0.5s linear infinite;
      animation: rotate 0.5s linear infinite;

      @-moz-keyframes rotate {
        100% {
          -moz-transform: rotate(360deg);
        }
      }
      @-webkit-keyframes rotate {
        100% {
          -webkit-transform: rotate(360deg);
        }
      }
      @keyframes rotate {
        100% {
          -webkit-transform: rotate(360deg);
          transform: rotate(360deg);
        }
      }
    }
  }

  div.rooms {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    height: 100%;
    width: 100%;
    overflow-y: scroll;

    button {
      margin: 10px;
    }
  }
`;

export default function RoomStartScreen({ send, context, colors }) {
  const animateRef = useRef();

  function rotateIcon() {
    animateRef.current.classList.add("animate_rotate");
    window.setTimeout(() => {
      animateRef.current?.classList?.remove("animate_rotate");
    }, 500);
  }

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

  return (
    <StyledPage>
      <div className="header">
        <h3>Available rooms</h3>
        <Rotate
          className="refreshButton"
          ref={animateRef}
          onClick={() => {
            rotateIcon();
            axios
              .get(`${process.env.REACT_APP_PEER_SERVER}/rooms/`)
              .then((result) => {
                return send("RETRIEVE_ROOMS", { rooms_available: result.data });
              })
              .catch((err) => {
                console.log(err.response);
              });
          }}
        />
      </div>
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
                send("ROOM_SELECTED", { name, colorPair });
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
