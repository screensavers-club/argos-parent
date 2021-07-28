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
        <div className="passwordBox">
          <input
            className="passInput"
            type="password"
            placeholder="set password"
          />
        </div>
      </div>
      <div className="buttonBox">
        <Button onClick={goClick}>Go</Button>
        <Button onClick={resetClick}>Back</Button>
      </div>
    </StyledPage>
  );
}
