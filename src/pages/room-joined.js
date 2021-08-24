import styled from "styled-components";
import Button from "../components/button";
import React, { useEffect, useRef } from "react";

import { useRoom } from "livekit-react";
import { RoomEvent } from "livekit-client";

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

export default function RoomJoined({ context, send, state }) {
  const { connect, isConnecting, room, error, participants, audioTracks } =
    useRoom();

  const audioContextRef = useRef();

  useEffect(() => {
    audioContextRef.current = new window.AudioContext();
  }, []);

  useEffect(() => {
    connect(process.env.REACT_APP_LIVEKIT_SERVER, context.token);
    return () => {
      room.disconnect();
    };
  }, []);

  useEffect(() => {
    // console.log(audioContextRef.current);
    // console.log(audioTracks.mediaStreamTrack);

    audioTracks.forEach((track) => {
      console.log(track);
      var audioCtx = audioContextRef.current;
      var source = audioCtx.createMediaStreamTrackSource(
        track.mediaStreamTrack
      );

      var bqf = audioCtx.createBiquadFilter();
      bqf.type = "lowshelf";
      bqf.frequency.setValueAtTime(1000, audioCtx.currentTime);
      bqf.gain.setValueAtTime(25, audioCtx.currentTime);

      source.connect(bqf).connect(audioCtx.destination);
    });
  }, [audioTracks]);

  return (
    <StyledPage>
      <div className="room">
        {audioTracks.map((audioTrack) => {
          return <div>Audio {audioTrack.sid}</div>;
        })}
      </div>
    </StyledPage>
  );
}
