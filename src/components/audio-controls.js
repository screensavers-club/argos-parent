import styled from "styled-components";
import React, { useState } from "react";
import Button from "./button";
import { Controls } from "react-ikonate";

const ControlPanel = styled.div`
  display: block;
  width: 250px;
  border: 1px solid black;
  padding: 10px;

  > div.buttons {
    display: flex;
    justify-content: center;
    > button {
      width: 100%;
      margin: 10px;
    }
  }

  > button {
    width: calc(100% - 20px);
  }
`;

export default function AudioControls({
  selectTab,
  setSelectTab,
  gridVariant,
}) {
  let [solo, setSolo] = useState(false);
  let [mute, setMute] = useState(false);
  let [volume, setVolume] = useState(0);

  console.log(solo);

  return (
    <ControlPanel>
      <div className="buttons">
        <Button
          variant="tiny"
          onClick={() => {
            if (solo === false) {
              setSolo(true);
            } else if (solo === true) {
              setSolo(false);
            }
          }}
        >
          S
        </Button>
        <Button
          variant="tiny"
          onClick={() => {
            if (mute === false) {
              setMute(true);
            } else if (mute === true) {
              setMute(false);
            }
          }}
        >
          M
        </Button>

        {solo === true ? (
          <div style={{ position: "absolute", botton: "50%", left: "50%" }}>
            solo is true
          </div>
        ) : (
          <></>
        )}
        {mute === true ? (
          <div style={{ position: "absolute", botton: "2%", left: "50%" }}>
            mute is true
          </div>
        ) : (
          <></>
        )}
      </div>
      <div className="buttons">
        <Button
          gridVariant="custom"
          onClick={() => {
            if (selectTab === "stream") {
              setSelectTab("mixer");
            }
          }}
          icon={<Controls />}
        ></Button>
      </div>
    </ControlPanel>
  );
}
