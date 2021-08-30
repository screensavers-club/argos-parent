import styled from "styled-components";
import Button from "./button";
import Slider, { Range } from "rc-slider";
import TogglePerformers from "./toggle-performers";

const Mixer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  border: 1px solid black;

  div.individualMixer {
    display: block;
    border: 1px solid black;
    height: 70vh;
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
  button.soloOff {
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

export default function MixerPage({ control, setControl }) {
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
                className={`solo ${control[i].solo === true ? "soloOn" : ""}`}
                variant="tiny"
                onClick={() => {
                  let _control = control.slice(0);
                  _control.map((a, i) => {
                    a.solo = [false, "blocked"];
                  });
                  _control[i].solo = !_control[i].solo;

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
              style={{ margin: "10px auto", padding: "auto", height: "200px" }}
              value={control[i].vol}
              onChange={(value) => {
                let _control = control.slice(0);
                _control[i].vol = value;
                console.log(_control);
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
    </Mixer>
  );
}
