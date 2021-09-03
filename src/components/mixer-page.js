import styled from "styled-components";
import Button from "./button";
import Slider, { Range } from "rc-slider";

import { useState } from "react";

const Mixer = styled.div`
  margin-top: 25px;
  background: white;
  z-index: 1;
  position: relative;
  display: flex;
  width: 100%;
  height: 75vh;
  padding: 25px;
  border: 1px solid black;

  div.individualMixer {
    width: auto;
    height: 100%;
    display: block;
    border: 1px solid black;
    padding: 10px;
  }

  div.masterMixer {
    position: absolute;
    right: 0;
    width: auto;
    display: block;
    border: 1px solid black;
    padding: 10px;
    transform: translate(-100%, 0);
  }

  button.advancedControls {
    width: 100%;
    margin: 10px 0;
  }

  div.solo-mute {
    display: flex;
    justify-content: center;
  }

  button.solo {
    margin: 5px;
    height: 1.5em;
    width: 1.5em;
  }

  button.soloOn {
    background: #faff00;
  }

  button.locked {
    background: #aaaaaa;
  }

  button.mute {
    margin: 5px;
    height: 1.5em;
    width: 1.5em;
  }

  button.muted {
    background: #00d1ff;
  }

  div.id {
    display: block;
    margin: auto;
    padding: auto;
    border: 1px solid black;

    > label {
      display: block;
      text-align: center;
      width: 100%;
      margin: 5px auto;
    }
  }
`;

export default function MixerPage({ control, setControl, master }) {
  let [toggleEQ, setToggleEQ] = useState(control);
  return (
    <Mixer>
      {control.map(({ id }, i) => {
        return (
          <div className="individualMixer">
            <Button className="advancedControls" onClick={() => {}}>
              eq
            </Button>
            <Button className="advancedControls" onClick={() => {}}>
              comp
            </Button>
            <Button className="advancedControls" onClick={() => {}}>
              reverb
            </Button>
            <Slider
              min={0}
              max={1}
              step={0.05}
              style={{ gridColumn: "1 / span 1" }}
            />
            <div className="solo-mute">
              <Button
                className={`solo ${
                  control[i].solo === true
                    ? "soloOn"
                    : `${control[i].solo === "locked" ? "locked" : ""}`
                }`}
                variant="tiny"
                onClick={() => {
                  let _control = control.slice(0);

                  if (_control[i].solo === false) {
                    _control.map((a) => {
                      return (a.solo = "locked");
                    });
                    _control[i].solo = true;
                  } else if (control[i].solo === true) {
                    _control.map((a) => {
                      return (a.solo = false);
                    });
                    _control[i].solo = false;
                  }

                  setControl(_control);
                }}
              >
                S
              </Button>
              <Button
                className={`mute ${control[i].mute === true ? "muted" : ""}`}
                variant="tiny"
                onClick={() => {
                  let _control = control.slice(0);
                  _control[i].mute = !_control[i].mute;
                  setControl(_control);
                }}
              >
                M
              </Button>
            </div>
            <Range
              trackStyle={[
                { backgroundColor: "black" },
                { backgroundColor: "transparent" },
                { backgroundColor: "black" },
              ]}
              handleStyle={[
                {
                  backgroundColor: "transparent",
                  borderColor: "transparent",
                },
                {
                  backgroundColor: "transparent",
                  borderColor: "transparent",
                },
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
              style={{
                margin: "10px auto",
                padding: "auto",
                height: "200px",
              }}
              value={control[i].vol}
              onChange={(value) => {
                let _control = control.slice(0);
                _control[i].vol = value;
                setControl(_control);

                if (_control[i].vol[0] > 0) {
                  _control[i].vol[0] = 0;
                }
              }}
            />

            <div className="id">
              <label>{id}</label>
            </div>
          </div>
        );
      })}

      <div className="masterMixer">
        <Button className="advancedControls" onClick={() => {}}>
          eq
        </Button>
        <Button className="advancedControls" onClick={() => {}}>
          comp
        </Button>
        <Button className="advancedControls" onClick={() => {}}>
          reverb
        </Button>
        <Slider
          min={0}
          max={1}
          step={0.05}
          style={{ gridColumn: "1 / span 1" }}
        />

        <Range
          trackStyle={[
            { backgroundColor: "black" },
            { backgroundColor: "transparent" },
            { backgroundColor: "black" },
          ]}
          handleStyle={[
            {
              backgroundColor: "transparent",
              borderColor: "transparent",
            },
            {
              backgroundColor: "transparent",
              borderColor: "transparent",
            },
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
          style={{
            margin: "10px auto",
            padding: "auto",
            height: "200px",
          }}
          value={master.vol}
          onChange={(value) => {
            let _control = control.slice(0);
            _control.map((a) => {
              console.log(value);
              return (a.vol = value);
            });
            setControl(_control);
          }}
        />

        <div className="id">
          <label>{master.name}</label>
        </div>
      </div>
    </Mixer>
  );
}
