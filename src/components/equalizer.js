import styled from "styled-components";
import Slider, { Range } from "rc-slider";

export default function Equalizer({ toggleEQ, control, setControl }) {
  if (toggleEQ === "undefined") {
    return <></>;
  } else {
    return (
      <Window>
        {control[toggleEQ].eq.map((props, i) => {
          let key = `key${i}`;

          return (
            <div className="equalizer">
              <span>{control[toggleEQ].id}</span>
              <span>{props.type}</span>
              <div className="visualiser"></div>
              <div className="eqControl">
                <div className="inputDiv">
                  <span>amplitude</span>
                  <input
                    defaultValue={0}
                    style={{ width: "100%" }}
                    value={control[toggleEQ].eq[i].amp}
                    onChange={(value) => {
                      let _control = control.slice(0);
                      _control[toggleEQ].eq[i].amp = value.target.value;
                      setControl(_control);
                      console.log(control);
                    }}
                  />
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
                  min={0}
                  max={1}
                  step={0.05}
                  style={{
                    margin: "10px auto",
                    padding: "auto",
                    width: "100px",
                  }}
                  value={[0, control[toggleEQ].eq[i].amp]}
                  onChange={(value) => {
                    let _control = control.slice(0);
                    _control[toggleEQ].eq[i].amp = value[1];
                    console.log(_control[toggleEQ].eq[i].amp[1]);
                    setControl(_control);
                    if (value[0] > 0) {
                      value[0] = 0;
                    }
                  }}
                />
              </div>
              <div className="eqControl">
                <div className="inputDiv">
                  <span>frequency</span>
                  <input
                    style={{ width: "100%" }}
                    value={control[toggleEQ].eq[i].freq}
                    onChange={(value) => {
                      let _control = control.slice(0);
                      _control[toggleEQ].eq[i].freq = value.target.value;
                      setControl(_control);
                      console.log(control);
                    }}
                  />
                </div>
                <div className="inputRange"></div>
              </div>
            </div>
          );
        })}

        <div></div>
      </Window>
    );
  }
}

const Window = styled.div`
  z-index: 5;
  background: white;
  position: relative;
  display: flex;
  justify-content: center;
  width: 100%;
  height: 200px;

  div.visualiser {
    width: 100%;
    height: 50%;
    border: 1px solid black;
  }

  div.equalizer {
    border: 1px solid black;
    width: 10%;
    text-align: center;
    padding: 10px;
  }

  div.eqControl {
    border: 1px solid black;
    > div {
      display: flex;
      > span {
        margin-right: 10px;
      }
    }
  }
`;
