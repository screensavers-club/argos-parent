import styled from "styled-components";
import Button from "../components/button";
import React, { useState, useEffect } from "react";
import axios from "axios";

const StyledPage = styled.div`
  display: block;
  margin: auto;
  padding: auto;
  text-align: center;

  div.availableRooms {
    display: block;
    margin: auto;
    margin-top: 7%;
    padding: auto;

    > Button {
      box-shadow: none;
      border: 1px solid black;
      border-radius: 0;
      margin-bottom: 25px;
      width: 45%;
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

  div.buttonBox {
    display: block;
    margin: auto;
    padding: auto;
  }
`;

export default function SelectRoom({ send, context }) {
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_PEER_SERVER}/rooms/`)
      .then((result) => {
        return send("RETRIEVE_ROOMS", { rooms_available: result.data });
      })
      .catch((err) => {
        console.log(err.response);
      });
  });

  return (
    <StyledPage>
      <div className="availableRooms">
        <h3>Available Rooms</h3>
        {context.rooms_available.map(function ({ name }, i) {
          let key = `key_${i}`;
          return (
            <Button
              onClick={() => {
                send("ROOM_SELECTED", { room: name });
              }}
            >
              {name}
            </Button>
          );
        })}
      </div>
      <div className="buttonBox">
        <Button
          onClick={() => {
            send("RETRIEVE_ROOMS");
          }}
        >
          Refresh
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
