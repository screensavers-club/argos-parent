import styled from "styled-components";
import Button from "../components/button";
import React, { useRef, useState } from "react";
import { Repeat } from "react-ikonate";
import "../animate.min.css";

import axios from "axios";

const StyledPage = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: #252529;

  div.section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    max-width: 400px;

    label {
      color: white;
      font-size: 36px;
      font-weight: 200;
    }
  }

  div.nameBox {
    display: flex;
    position: relative;
    width: 630px;
    height: 70px;
    background: #434349;
    border-radius: 50px;
    justify-content: center;
    align-items: center;

    span {
      background: ${(p) =>
        `-webkit-linear-gradient(135deg, ${p.color ? p.color[0] : "#fff"}, ${
          p.color ? p.color[1] : "#fff"
        })`};

      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    button {
      flex-grow: 0;
      width: 3rem;
      height: 3rem;
      background: none;
      border: 0;
      appearance: none;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 1.5rem;
      cursor: pointer;
    }
  }

  input {
    font-size: 1.5rem;
    appearance: none;
    padding: 0.5em 1em;
    width: 100%;
    height: auto;
    border-radius: 0;
    border: 1px solid black;
    text-align: center;
  }

  div.buttonBox {
    display: flex;
    justify-content: center;

    button {
      margin: 0 0.5em;
    }
  }
`;

export default function FetchedRoom({ context, send, colors }) {
  let [passcode, setPasscode] = useState();
  let ref = useRef();

  const fruits = context.room.name?.split("-");
  const colorPair = fruits?.map((fruit, i) => {
    let key = `key${i}`;

    return Object.keys(colors).find((hex) => {
      return colors[hex].indexOf(fruit) > -1;
    });
  });

  return (
    <StyledPage color={colorPair}>
      <div className="section">
        <label>Room name</label>
        <div className="nameBox">
          <span>{context.room.name}</span>
          <button
            onClick={() => {
              axios
                .get(`${process.env.REACT_APP_PEER_SERVER}/generate-room-name`)
                .then((result) => {
                  if (result.data?.name) {
                    // console.log(result);

                    send("SET_NEW_ROOM_NAME", { name: result.data.name });
                  }
                });
            }}
          >
            <Repeat />
          </button>
        </div>
      </div>
      <div className="section">
        <label>Set passcode</label>
        <input
          ref={ref}
          className="passInput"
          type="text"
          value={passcode}
          onChange={(e) => {
            setPasscode(
              e.target.value
                .split("")
                .filter((c) => {
                  return "0123456789".indexOf(c) > -1;
                })
                .filter((c, i) => {
                  return i < 5;
                })
                .join("")
            );
          }}
        />
      </div>
      <div className="buttonBox section">
        <Button
          onClick={() => {
            const payload = {
              room: context.room.name,
              passcode: passcode,
              identity: context.identity,
            };
            // console.log(payload.passcode);
            if (payload.passcode.length > 0 && payload.passcode.length < 5) {
              {
                ref.current?.classList?.add(
                  "animate__animated",
                  "animate__shakeX"
                );
                window.setTimeout(() => {
                  ref.current?.classList?.remove(
                    "animate__animated",
                    "animate__shakeX"
                  );
                }, 2000);
              }
            } else {
              axios
                .post(
                  `${process.env.REACT_APP_PEER_SERVER}/parent/room/new`,
                  payload
                )
                .then((result) => {
                  // console.log(result);
                  return send("RECEIVE_TOKEN", { token: result.data.token });
                });
            }
          }}
        >
          Go
        </Button>
        <Button
          onClick={() => {
            send("DISCONNECT");
          }}
        >
          Back
        </Button>
      </div>
    </StyledPage>
  );
}
