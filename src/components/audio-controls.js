import styled from "styled-components";
import React from "react";
import Button from "./button";
import { Controls } from "react-ikonate";

import { Range } from "rc-slider";
import "rc-slider/assets/index.css";

const ControlPanel = styled.div`
  position: relative;
  display: block;
  width: 250px;
  height: 250px;
  border: 1px solid black;
  padding: 10px;
  justify-content: center;
  align-items: center;

  > label {
    display: block;
    margin: auto;
    padding: auto;
  }

  > div.panel {
    display: flex;
    justify-content: center;
    margin: 10px;
  }

  div.buttons {
    margin: 10px 25px;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-column-gap: 10px;
    grid-row-gap: 10px;

    > button.solo {
      grid-column: 2 / span 1;
      height: 3em;
    }

    > button.soloOn {
      background: #faff00;
    }

    > button.locked {
      background: #aaaaaa;
    }

    > button.mute {
      grid-column: 3 / span 1;
      height: 3em;
    }

    > button.muted {
      background: #00d1ff;
    }

    > button.mixer {
      grid-column: 2 / span 2;
      height: 3em;
      width: 5em;
    }
  }
`;

export default function AudioControls({
  setSelectTab,
  control,
  setControl,
  activeControl,
  soloValue,
  muteValue,
}) {
  return (
    <ControlPanel>
      <label>audio controls</label>

      <div className="panel">
        <div className="buttons">
          <Range
            trackStyle={[
              { backgroundColor: "black" },
              { backgroundColor: "transparent" },
              { backgroundColor: "black" },
            ]}
            handleStyle={[
              { backgroundColor: "transparent", borderColor: "transparent" },
              { backgroundColor: "transparent", borderColor: "transparent" },
              {
                backgroundColor: "white",
                borderRadius: "25px",
                width: "1.5em",
                left: "0",
                border: "1px solid black",
              },
            ]}
            railStyle={{ border: "1px solid black" }}
            vertical
            min={0}
            max={1}
            step={0.05}
            style={{ gridColumn: "1 / span 1", gridRow: "1 / span 2" }}
            value={control[activeControl].vol}
            onChange={(value) => {
              let _control = control.slice(0);
              _control[activeControl].vol = value;
              console.log(_control[activeControl].vol);
              setControl(_control);

              if (_control[activeControl].vol[0] > 0) {
                _control[activeControl].vol[0] = 0;
              }
            }}
          />

          <Button
            className={`solo ${
              soloValue === true
                ? "soloOn"
                : `${soloValue === "locked" ? "locked" : ""}`
            }`}
            variant="tiny"
            onClick={() => {
              let _control = control.slice(0);
              _control
                .filter((a, i) => {
                  return i != activeControl;
                })
                .forEach((a, i) => {
                  a.solo === true ? (a.solo = true) : (a.solo = "locked");
                });
              if (soloValue === "locked") {
                return;
              } else {
                soloValue = !soloValue;
              }

              if (soloValue === false) {
                _control.forEach((a, i) => {
                  a.solo = false;
                });
              }

              _control[activeControl].solo = soloValue;
              setControl(_control);
            }}
          >
            S
          </Button>
          <Button
            className={`mute ${muteValue === true ? "muted" : ""}`}
            variant="tiny"
            onClick={() => {
              let _control = control.slice(0);
              _control[activeControl].mute = !muteValue;
              setControl(_control);
            }}
          >
            M
          </Button>
          <Button
            className="mixer"
            variant="small"
            onClick={() => {
              setSelectTab("mixer");
            }}
          >
            <Controls />
          </Button>
        </div>
      </div>
    </ControlPanel>
  );
}
