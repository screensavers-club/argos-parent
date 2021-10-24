import styled from "styled-components";
import axios from "axios";
import { User, Plus, Rotate } from "react-ikonate";
import { useEffect, useRef } from "react";

import Card from "../components/room-card";

const StyledPage = styled.div`
  background: #191920;
  height: calc(100% - 35px);
  align-items: center;
  justify-content: center;
  display: block;

  div.header {
    display: flex;
    justify-content: flex-start;
    color: white;
    width: calc(100% - 32px);
    margin: 0 16px;
    padding: 2rem 0 0 0;

    h3 {
      font-weight: 200;
      font-size: 36px;
      line-height: 1;
      margin: 0;
    }

    svg.refreshButton {
      margin: auto 0 auto 8px;
      stroke-width: 1px;
      font-size: 42px;
      position: relative;
      top: -4px;

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
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    width: 100%;
    padding: 16px;
    overflow-y: scroll;
    gap: 16px;
    box-sizing: border-box;
    max-height: calc(100% - 82px);

    @media screen and (max-width: 760px) {
      grid-template-columns: repeat(2, 1fr);
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
        <h3>Rooms</h3>
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
          gradient={`linear-gradient(135deg, #333, #556)`}
          onClick={() => {
            send("CREATE_ROOM");
          }}
        >
          Create room
        </Card>
        {context.rooms_available
          .sort((a, b) => {
            return a.room > b.room ? -1 : 1;
          })
          .map(function ({ room, children }, i) {
            const fruits = room.split("-");
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
                participants={children.length}
                icon={<User />}
                gradient={`linear-gradient(135deg, ${colorPair[0]}, ${colorPair[1]})`}
                onClick={() => {
                  send("ROOM_SELECTED", { name: room, colorPair });
                }}
              >
                {room}
              </Card>
            );
          })}
      </div>
    </StyledPage>
  );
}
