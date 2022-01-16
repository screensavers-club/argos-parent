import axios from "axios";
import { DataPacket_Kind } from "livekit-client";
import { Download, Upload } from "react-ikonate";
import { useState, useEffect } from "react";
import styled from "styled-components";
import Popper from "../message-popper";

export default function MixPresetsControl({
  room,
  updateMix,
  mixSlots = [
    "Slot 1",
    "Slot 2",
    "Slot 3",
    "Slot 4",
    "Slot 5",
    "Slot 6",
    "Slot 7",
    "Slot 8",
  ],
  updateSlots,
}) {
  const [successIndicator, setSuccessIndicator] = useState(null);
  const [editing, setEditing] = useState(null);

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
        {mixSlots.map((slot, i) => {
          return (
            <Slot key={`slot_${slot}`}>
              {editing === i ? (
                <div className="rename">
                  <input
                    type="text"
                    placeholder={slot}
                    maxLength={8}
                    minLength={3}
                    autoFocus={1}
                    onBlur={(e) => {
                      setEditing(null);
                      const slotName = e.target.value
                        .replace(/[^a-zA-Z0-9]+/g, "_")
                        .toUpperCase();
                      axios
                        .post(
                          `${process.env.REACT_APP_PEER_SERVER}/${room.name}/mix/name/${i}`,
                          { slotName }
                        )
                        .then(() => {
                          updateSlots();
                        })
                        .catch((err) => {
                          console.log(JSON.stringify(err));
                        });
                    }}
                  />
                </div>
              ) : (
                <label
                  onClick={() => {
                    setEditing(i);
                  }}
                >
                  {slot}
                </label>
              )}

              <button
                onClick={() => {
                  axios
                    .post(
                      `${process.env.REACT_APP_PEER_SERVER}/${room.name}/mix/save/${i}`
                    )
                    .then(() => {
                      setSuccessIndicator({
                        action: "Saved",
                        target: slot,
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
                      `${process.env.REACT_APP_PEER_SERVER}/${room.name}/mix/load/${i}`
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
                        target: slot,
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
  /* flex-grow: 1; */
  width: calc((100% - 8rem) / 8);
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

  > div.rename {
    display: flex;
    width: 100%;
    overflow: hidden;
    width: 100%;
    height: 50%;
    order: 3;
    justify-content: center;
    align-items: center;

    input[type="text"] {
      display: block;
      font-size: 0.8rem;
      text-transform: uppercase;
      width: 100%;
      height: 100%;
      text-align: center;
    }
  }
`;
