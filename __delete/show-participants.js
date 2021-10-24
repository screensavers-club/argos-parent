import styled from "styled-components";
import React, { useState, useEffect } from "react";

const ParticipantsDiv = styled.div`
  display: flex;
  align-content: center;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
  position: absolute;
  left: 0;
  bottom: 0;
  top: 0;
  right: 0;

  > div.streamWrapper {
    position: relative;
    justify-content: center;
    vertical-align: middle;
    align-self: center;
    overflow: hidden;
    flex-wrap: wrap;
    display: inline-flex;
    border: 1px solid grey;
    width: 100%;

    > div.userVideo {
      position: relative;
      min-width: 33%;
      width: auto;
      max-width: 100%;
      margin: auto;
      padding: auto;
      border: 1px solid red;
    }
  }
`;

const Participant = styled.div`
  width: 100%;
  height: 0;
  padding-top: ${(p) => 100 * p.ratio}%;
  box-sizing: border-box;

  > img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export function ShowParticipants({ participants }) {
  let [number, setNumber] = useState(1);

  // useEffect(() => {
  //   participants.map(function (p, i, arr) {
  //     setNumber(arr.length);
  //   });
  // });

  return (
    <ParticipantsDiv number={number} setNumber={setNumber}>
      <div className="streamWrapper">
        {participants.map(function ({ name, track }, i, arr) {
          arr.length = number;

          return (
            <div className="userVideo">
              <Participant ratio={480 / 800}>
                <img src="/images/user.png" />
              </Participant>
            </div>
          );
        })}
      </div>

      <div className="content"></div>
      <div style={{ position: "absolute", bottom: "0", left: "50%" }}>
        <button
          onClick={() => {
            if (number >= 1 && number <= 10) {
              return setNumber(number + 1);
            }
            if (number > 10) {
              return setNumber((number = 10));
            }
            if (number < 1) {
              return setNumber((number = 1));
            }
          }}
        >
          +
        </button>
        <button
          onClick={() => {
            if (number >= 1 && number <= 10) {
              return setNumber(number - 1);
            }
            if (number > 10) {
              return setNumber((number = 10));
            }
            if (number < 1) {
              return setNumber((number = 1));
            }
          }}
        >
          -
        </button>
      </div>
    </ParticipantsDiv>
  );
}
