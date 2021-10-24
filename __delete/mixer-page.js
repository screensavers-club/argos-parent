import styled from "styled-components";
import Button from "./button";
import Slider, { Range } from "rc-slider";
import Equalizer from "./equalizer";

import { useState } from "react";

const Mixer = styled.div`
  display: block;
  margin: auto;
  padding: auto;

  div.mixer {
    margin-top: 25px;
    background: white;
    z-index: 1;
    position: relative;
    display: flex;
    width: 100%;
    height: 75vh;
    padding: 25px;
    border: 1px solid black;
  }

  div.masterMixer {
    position: absolute;
    right: 0;
    width: auto;
    height: 100%;
    display: block;
    border: 1px solid black;
    padding: 10px;
    transform: translate(-100%, 0);
  }

  div.individualMixer {
    width: auto;
    height: 100%;
    display: block;
    border: 1px solid black;
    padding: 10px;
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

  button.active {
    background: grey;
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

export default function MixerPage({ control, setControl, master, setMaster }) {
  let [toggleEQ, setToggleEQ] = useState("undefined");
  // console.log(toggleEQ);
  return (
    <Mixer>
      <Equalizer
        toggleEQ={toggleEQ}
        control={control}
        setControl={setControl}
        master={master}
        setMaster={setMaster}
      />
      <div className="mixer">
        <div className="masterMixer">
          <Button
            className={`advancedControls ${
              toggleEQ === "master" ? "active" : ""
            }`}
            onClick={(e) => {
              if (toggleEQ != "master") {
                setToggleEQ("master");
              } else {
                setToggleEQ("undefined");
              }
            }}
          >
            eq
          </Button>
          <Button
            className={`advancedControls ${
              master.comp === true ? "active" : ""
            }`}
            onClick={(e) => {
              let _control = control.slice(0);
              let _master = master;
              _master.comp = !master.comp;
              _control.map((a) => {
                return (a.comp = _master.comp);
              });
              setControl(_control);
              setMaster(_master);
            }}
          >
            comp
          </Button>
          <Button
            className={`advancedControls ${
              master.reverb === true ? "active" : ""
            }`}
            onClick={(e) => {
              let _control = control.slice(0);
              let _master = master;
              _master.reverb = !master.reverb;
              _control.map((a) => {
                return (a.reverb = _master.reverb);
              });
              setControl(_control);
              setMaster(_master);
            }}
          >
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
              height: "100px",
            }}
            value={master.vol}
            onChange={(value) => {
              let _control = control.slice(0);
              let _master = master;
              _control.map((a) => {
                console.log(a);
                return (a.vol = value);
              });
              _master.vol = value;
              setControl(_control);
              setMaster(_master);
            }}
          />

          <div className="id">
            <label>{master.name}</label>
          </div>
        </div>

        {control.map(({ id }, i) => {
          return (
            <div className="individualMixer">
              <Button
                className={`advancedControls ${toggleEQ === i ? "active" : ""}`}
                onClick={() => {
                  setToggleEQ(i);
                  if (toggleEQ === i) {
                    setToggleEQ("undefined");
                  }
                }}
              >
                eq
              </Button>
              <Button
                className={`advancedControls ${
                  control[i].comp === true ? "active" : ""
                }`}
                onClick={(e) => {
                  let _control = control.slice(0);
                  _control[i].comp = !control[i].comp;
                  setControl(_control);
                }}
              >
                comp
              </Button>
              <Button
                className={`advancedControls ${
                  control[i].reverb === true ? "active" : ""
                }`}
                onClick={(e) => {
                  let _control = control.slice(0);
                  _control[i].reverb = !control[i].reverb;
                  setControl(_control);
                }}
              >
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
                  height: "100px",
                }}
                value={control[i].vol}
                onChange={(value) => {
                  let _control = control.slice(0);
                  _control[i].vol = value;
                  setControl(_control);

                  if (_control[i].vol[0] > 0) {
                    _control[i].vol[0] = 0;
                  }
                  // console.log(control);
                }}
              />

              <div className="id">
                <label>{id}</label>
              </div>
            </div>
          );
        })}
      </div>
    </Mixer>
  );
}