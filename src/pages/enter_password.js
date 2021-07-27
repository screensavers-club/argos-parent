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
    border: 1px solid black;
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
    font-size: 1em;
  }

  input,
  select {
    font-size: 1em;
    border-style: none;
    width: 100%;
    height: auto;
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

export default function EnterPassword({ roomName, resetClick, joinRoom }) {
  return (
    <StyledPage>
      <div className="room">
        <h3>{roomName}</h3>
      </div>
      <h3>Enter password</h3>
      <div className="password">
        <div className="passwordBox">
          <input className="passInput" type="text" min="0" max="9" />
        </div>
      </div>
      <div className="buttonBox">
        <Button onClick={joinRoom}>Go</Button>
        <Button onClick={resetClick}>Back</Button>
      </div>
    </StyledPage>
  );
}