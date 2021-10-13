import styled from "styled-components";
import Button from "../components/button";
import React, { useState, useRef } from "react";
import axios from "axios";
import "../animate.min.css";

const StyledPage = styled.div`
  display: block;
  margin: auto;
  padding: auto;
  text-align: center;

  div.roomName {
    display: block;
    margin-top: 7%;
  }

  div.nameBox {
    position: relative;
    text-align: center;
    border: 1px solid black;
    height: 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 45%;
    padding: 25px;
    margin: auto;
    font-size: 1.5rem;

    > button {
      position: absolute;
      right: 0;
      height: 100%;
      box-shadow: none;
      border: none;
      border-radius: 0;
      width: 50px;
      margin-bottom: 0;
    }
  }

  Button {
    display: block;
    margin: auto;
    padding: auto;
    height: 100px;
    width: 200px;
    margin-bottom: 25px;
  }

  div.roomName ~ h3 {
    margin-top: 50px;
  }

  div.password {
    display: flex;
    margin: 25px;
    align-items: center;
    justify-content: center;
  }

  div.passwordBox {
    padding: 25px;
    margin: 12.5px;
    width: 45%;
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
    font-size: 2em;
    border-style: none;
    width: 100%;
    height: auto;
    border-radius: 0;
    border: 1px solid black;
  }

  div.buttonBox {
    display: block;
    margin: auto;
    padding: auto;
  }
`;

// function passwords({}){
//   return
//   <div
// }

// let [number, setNumber] = useState();

export default function EnterPassword({ send, context }) {
  let [passcode, setPasscode] = useState("");
  let ref = useRef();
  return (
    <StyledPage>
      <div className="room">
        <h3>{context.joining_room}</h3>
      </div>
      <div className="password" ref={ref}>
        <div className="passwordBox">
          <input
            className="passInput"
            type="password"
            maxLength="5"
            placeholder="enter password"
            value={passcode}
            onChange={(e) => {
              setPasscode(e.target.value);
            }}
          />
        </div>
      </div>
      <div className="buttonBox">
        <Button
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
