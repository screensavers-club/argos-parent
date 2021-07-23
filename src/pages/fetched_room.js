import styled from "styled-components";
import Button from "../components/button";
import React, { useState } from "react";

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
    }
  }

  Button {
    display: block;
    margin: auto;
    margin-bottom: 25px;
    padding: auto;
    height: 100px;
    width: 200px;
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
    border: 1px solid black;
    padding: 25px;
    margin: 12.5px;
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
    width: 10px;
    position: absolute;
    text-align: center;
    font-size: 1em;
  }

  input,
  select {
    font-size: 1em;
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

export default function FetchedRoom({
  roomName,
  resetClick,
  passwords,
  goClick,
  reRoll,
}) {
  return (
    <StyledPage>
      <div className="roomName">
        <h3>room name</h3>
        <div className="nameBox">
          <h3>{roomName}</h3>
          <Button onClick={reRoll}>Re-Roll</Button>
        </div>
      </div>
      <h3>Set a passcode</h3>
      <div className="password">
        {passwords.map(function ({ password }, i) {
          let key = "key_" + i;
          return (
            <div className="passwordBox" key={key}>
              <input className="passInput" type="number" min="0" max="9" />
            </div>
          );
        })}
      </div>
      <div className="buttonBox">
        <Button onClick={goClick}>Go</Button>
        <Button onClick={resetClick}>Send Reset</Button>
      </div>
    </StyledPage>
  );
}
