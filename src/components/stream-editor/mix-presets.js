import axios from "axios";
import { DataPacket_Kind } from "livekit-client";
import { Download, Upload } from "react-ikonate";
import { useState, useEffect } from "react";
import styled from "styled-components";
import Popper from "../message-popper";

export default function MixPresetsControl({ room, updateMix }) {
  const [successIndicator, setSuccessIndicator] = useState(null);

  useEffect(() => {
    if (successIndicator) {
      window.setTimeout(() => {
        setSuccessIndicator(null);
      }, 1000);
    }
  }, [successIndicator]);

  return (
    <>
      <PresetsBar>
        <label>Audio Presets</label>
        {[0, 1, 2, 3, 4, 5, 6, 7].map((n, i) => {
          return (
            <Slot key={`slot_${n}`}>
              <label>Slot {n + 1}</label>
              <button
                onClick={() => {
                  axios
                    .post(
                      `${process.env.REACT_APP_PEER_SERVER}/${room.name}/mix/save/${n}`
                    )
                    .then(() => {
                      setSuccessIndicator({
                        action: "Saved",
                        target: `Slot ${n + 1}`,
                      });
                    })
                    .catch((err) => {
                      console.log({ err });
                    });
                }}
              >
                <Download />
              </button>
              <button
                onClick={() => {
                  axios
                    .post(
                      `${process.env.REACT_APP_PEER_SERVER}/${room.name}/mix/load/${n}`
                    )
                    .then(() => {
                      const payload = JSON.stringify({
                        action: "MIX",
                      });
                      const encoder = new TextEncoder();
                      const data = encoder.encode(payload);

                      room.localParticipant.publishData(
                        data,
                        DataPacket_Kind.RELIABLE
                      );
                      updateMix();

                      setSuccessIndicator({
                        action: "Loaded",
                        target: `Slot ${n + 1}`,
                      });
                    });
                }}
              >
                <Upload />
              </button>
            </Slot>
          );
        })}
      </PresetsBar>
      <Popper
        message={
          successIndicator && (
            <>
              {successIndicator.action} slot{" "}
              <strong>{successIndicator.target}</strong>
            </>
          )
        }
      />
    </>
  );
}

const PresetsBar = styled.div`
  width: calc(100% - 32px);
  height: 66px;
  position: absolute;
  left: 16px;
  bottom: 16px;
  background: #343439;
  box-sizing: border-box;
  color: #fff;
  border-radius: 8px 8px 15px 15px;
  display: flex;
  justify-content: stretch;
  overflow: hidden;

  > label {
    display: flex;
    width: 8rem;
    font-size: 0.8rem;
    text-transform: uppercase;
    justify-content: center;
    align-items: center;
    color: #aaaaae;
  }
`;

const Slot = styled.div`
  flex-grow: 1;
  border-left: 1px solid #222225;
  display: flex;
  flex-wrap: wrap;

  button {
    display: flex;
    width: 50%;
    height: 50%;
    font-size: 0.9rem;
    text-transform: uppercase;
    justify-content: center;
    align-items: center;
    border-radius: 0;
    border: 0;
    border-bottom: 1px solid #222225;
    appearance: none;
    outline: none;
    background: transparent;
    color: #aaaaae;
    cursor: pointer;

    & + button {
      border-left: 1px solid #222225;
    }

    &:hover {
      color: #fff;
      background: #aaaaae;
    }
  }

  label {
    display: flex;
    width: 100%;
    height: 50%;
    order: 3;
    font-size: 0.8rem;
    text-transform: uppercase;
    justify-content: center;
    align-items: center;
  }
`;
