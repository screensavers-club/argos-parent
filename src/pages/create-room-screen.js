import styled from "styled-components";
import Button from "../components/button";
import React, { useState } from "react";

import axios from "axios";

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

    > Button {
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

export default function FetchedRoom({ context, send }) {
  let [passcode, setPasscode] = useState();

  return (
    <StyledPage>
      <div className="roomName">
        <h3>room name</h3>
        <div className="nameBox">
          <p>{context.room.name}</p>
          <Button
            onClick={() => {
              // send("REROLL_ROOM_NAME");
              axios
                .get(`${process.env.REACT_APP_PEER_SERVER}/generate-room-name`)
                .then((result) => {
                  if (result.data?.name) {
                    console.log(result);
                    send("SET_NEW_ROOM_NAME", { name: result.data.name });
                  }
                });
            }}
          >
            Re-Roll
          </Button>
        </div>
      </div>
      <h3>Set a passcode</h3>
      <div className="password">
        <div className="passwordBox">
          <input
            className="passInput"
            type="password"
            placeholder="set password"
            minLength="5"
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
          onClick={() => {
            const payload = {
              room: context.room.name,
              passcode: passcode,
              identity: context.identity,
            };

            axios
              .post(
                `${process.env.REACT_APP_PEER_SERVER}/parent/room/new`,
                payload
              )
              .then((result) => {
                console.log(result);
                return send("RECEIVE_TOKEN", { token: result.data.token });
              });
          }}
        >
          Go
        </Button>
        <Button
          onClick={() => {
            send("RESET");
          }}
        >
          Back
        </Button>
      </div>
    </StyledPage>
  );
}
