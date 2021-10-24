import styled from "styled-components";
import Button from "../components/button";
import React, { useRef, useState } from "react";
import { Repeat, Lock, ArrowLeft, ArrowRight } from "react-ikonate";
import "../animate.min.css";

import axios from "axios";

const StyledPage = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 100%;
  background: #191920;

  div.top {
    margin-top: 120px;
  }

  div.section {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    width: 100%;

    label {
      color: white;
      font-size: 36px;
      font-weight: 400;
      margin-bottom: 0.3em;
    }
  }

  div.nameBox {
    display: flex;
    position: relative;
    width: 30rem;
    height: 70px;
    background: #292933;
    border-radius: 50px;
    justify-content: stretch;
    align-items: center;
    margin-bottom: 4rem;
    padding: 0 16px 0 32px;
    box-sizing: border-box;

    span {
      flex-grow: 1;
      background: ${(p) =>
        `-webkit-linear-gradient(135deg, ${p.color ? p.color[0] : "#fff"}, ${
          p.color ? p.color[1] : "#fff"
        })`};
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-size: 36px;
      line-height: 1.2;
      font-weight: normal;
      text-align: left;
      overflow-x: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      display: block;
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

      svg {
        color: white;
        stroke-width: 1.5px;
        font-size: 2rem;
        position: relative;
        top: 2px;
      }
    }
  }
  div.inputDiv {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    background: #292933;
    border-radius: 100px;
    width: 300px;
    height: 56px;

    svg {
      stroke-width: 1.5px;
      font-size: 36px;
      stroke: white;
      margin: 0 15px;
      stroke-linecap: "round";
      stroke-linejoin: "round";
    }

    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
      width: 10px;
      position: absolute;
      text-align: center;
    }

    input {
      padding-left: 15px;
      font-style: normal;
      font-weight: 400;
      background: none;
      font-size: 36px;
      color: white;
      width: 165px;
      height: 75%;
      outline: none;
      appearance: 0;
      border: 0;
    }
  }
  div.buttonBox {
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-between;
    justify-content: center;
    width: 100%;

    button {
      margin: 25px 15px;
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
      <div className="section top">
        <label className="roomName">Room name</label>
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
        <label className="setPassword">Set passcode</label>
        <div className="inputDiv" ref={ref}>
          <Lock />
          <input
            className="passInput"
            type="text"
            value={passcode}
            autoFocus={2}
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
      </div>
      <div className="buttonBox section">
        <Button
          variant="navigation"
          icon={<ArrowRight />}
          type="primary"
          onClick={() => {
            const payload = {
              room: context.room.name,
              passcode: passcode,
              identity: context.identity,
            };
            if (!payload.passcode || payload.passcode.length < 5) {
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
                  return send("RECEIVE_TOKEN", {
                    token: result.data.token,
                    passcode,
                  });
                });
            }
          }}
        >
          Enter
        </Button>
        <Button
          variant="navigation"
          icon={<ArrowLeft />}
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
