import styled from "styled-components";
import Button from "../components/button";
import React, { useState, useRef } from "react";
import axios from "axios";
import "../animate.min.css";
import { ArrowRight, ArrowLeft, Lock } from "react-ikonate";
import { fromPairs } from "lodash";

const StyledPage = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  background: #252529;
  width: 100%;
  height: 100%;

  div.room {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;

    span {
      margin-top: 170px;
      font-size: 36px;
      font-weight: 200;
      color: white;
    }

    h3 {
      background: ${(p) =>
        `-webkit-linear-gradient(135deg, ${
          p.context.color ? p.context.color[0] : "#fff"
        }, ${p.context.color ? p.context.color[1] : "#fff"})`};

      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-size: 36px;
      font-weight: 900;
      margin: 30px;
    }
  }

  div.password {
    display: flex;
    justify-content: center;
  }

  div.inputDiv {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    background: #434349;
    border-radius: 100px;
    width: 265px;
    height: 56px;
    margin: 10px 90px;

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

    input,
    select {
      padding-left: 15px;
      font-family: "Noto Sans";
      font-style: normal;
      font-weight: 200;
      background: none;
      font-size: 36px;
      color: white;
      border-style: none;
      width: 165px;
      height: 75%;
      border-left: 1px solid white;
      outline: none;
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

export default function EnterPassword({ send, context }) {
  let [passcode, setPasscode] = useState("");
  let ref = useRef();
  console.log(context);
  return (
    <StyledPage context={context}>
      <div className="room">
        <span>Enter password for</span>
        <h3>{context.joining_room}</h3>
      </div>
      <div className="password">
        <div className="inputDiv" ref={ref}>
          <Lock />
          <input
            className="passInput"
            type="password"
            maxLength="5"
            value={passcode}
            onChange={(e) => {
              setPasscode(e.target.value);
            }}
          />
        </div>
      </div>

      <div className="buttonBox">
        <Button
          variant="navigation"
          type="primary"
          icon={<ArrowRight />}
          onClick={() => {
            let payload = {
              room: context.joining_room,
              passcode: passcode,
              identity: context.identity,
            };
            axios
              .post(
                `${process.env.REACT_APP_PEER_SERVER}/parent/room/join`,
                payload
              )
              .then((result) => {
                return send("CHECK_INPUT", {
                  token: result.data.token,
                  passcode,
                });
              })
              .catch((err) => {
                console.log(err.response);
                if (
                  err.response.data.err ===
                  `Wrong passcode provided for room ${context.joining_room}`
                ) {
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
              });
          }}
        >
          Enter
        </Button>
        <Button
          variant="navigation"
          onClick={() => {
            send("DISCONNECT");
          }}
          icon={<ArrowLeft />}
        >
          Back
        </Button>
      </div>
    </StyledPage>
  );
}
