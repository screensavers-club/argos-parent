import styled from "styled-components";
import Button from "../components/button";
import React, { useState } from "react";
import { Repeat } from "react-ikonate";

import axios from "axios";

const StyledPage = styled.div`
  display: block;
  margin: auto;
  padding: auto;
  text-align: center;

  div.section {
    display: block;
    width: 70%;
    max-width: 400px;
    margin: 2rem auto 0 auto;

    label {
      display: block;
      margin: 0 0 1em 0;
    }
  }

  div.nameBox {
    display: flex;
    position: relative;
    border: 1px solid black;
    height: 3rem;
    justify-content: center;
    align-items: center;
    margin: auto;
    font-size: 1.5rem;

    span {
      flex-grow: 1;
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

export default function FetchedRoom({ context, send }) {
  let [passcode, setPasscode] = useState();

  return (
    <StyledPage>
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
                    console.log(result);
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
        <label>Passcode</label>
        <input
          className="passInput"
          type="password"
          placeholder="set passcode (digits only)"
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
