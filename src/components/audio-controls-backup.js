import styled from "styled-components";
import React, { useState } from "react";
import Button from "./button";
import { Controls } from "react-ikonate";

import Slider from "rc-slider";
import "rc-slider/assets/index.css";

const { Range } = Slider;

const style = {
  float: "left",
  width: 160,
  height: 400,
  marginBottom: 160,
  marginLeft: 50,
};
const parentStyle = { overflow: "hidden" };

const ControlPanel = styled.div`
  position: relative;
  display: flex;
  width: 250px;
  border: 1px solid black;
  padding: 10px;
  justify-content: center;
  align-items: center;

  > label {
    position: absolute;
    width: 100%;
    left: 10px;
    top: 10px;
  }

  div.buttons {
    display: block;
    margin: auto;
    padding: auto;
    width: 100%;
    height: 120px;
  }

  div.solo-mute {
    display: flex;
    justify-content: center;
    > button {
      width: 100%;
      margin: 10px;
      height: 50px;
      background-color: ${(p) => (p.solo === true ? "red" : "white")};
    }
  }

  div.mixer {
    display: flex;
    justify-content: center;
    > button {
      width: 100%;
      height: 50px;
      margin: 10px;
    }
  }

  div.volumeSlider {
    height: 200px;
    margin: 40px;
  }
`;

class ControlledRangeDisableAcross extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: [0, 20, 60],
    };
  }

  handleChange = (value) => {
    this.setState({
      value,
    });
  };

  render() {
    if (this.state.value[0] > 0) {
      this.state.value[0] = 0;
    }

    return (
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
        value={this.state.value}
        onChange={this.handleChange}
        allowCross={false}
        {...this.props}
      />
    );
  }
}

const input = [
  {
    performer: "performer 1",
    vol: 0.5,
    solo: false,
    mute: false,
    toggleMixer: false,
  },
  {
    performer: "performer 2",
    vol: 0.5,
    solo: false,
    mute: false,
    toggleMixer: false,
  },
  {
    performer: "performer 3",
    vol: 0.5,
    solo: false,
    mute: false,
    toggleMixer: false,
  },
  {
    performer: "performer 4",
    vol: 0.5,
    solo: false,
    mute: false,
    toggleMixer: false,
  },
  {
    performer: "performer 5",
    vol: 0.5,
    solo: false,
    mute: false,
    toggleMixer: false,
  },
];

export default function AudioControls({ selectTab, setSelectTab }) {
  let [solo, setSolo] = useState(false);
  let [mute, setMute] = useState(false);
  let [volumeInput, setVolumeInput] = useState(0);

  return (
    <ControlPanel solo={solo} mute={mute}>
      <label>audio controls</label>
      <div className="volumeSlider">
        <ControlledRangeDisableAcross
          vertical
          volumeInput={volumeInput}
          setVolumeInput={setVolumeInput}
        />
      </div>
      <div className="buttons">
        <div className="solo-mute">
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

          <div
            className="results"
            style={{ position: "absolute", left: "50%", bottom: "10%" }}
          >
            {solo === true ? (
              <div style={{ position: "relative" }}>
                solo is true;; bg yellow
              </div>
            ) : (
              <></>
            )}
            {mute === true ? (
              <div style={{ position: "relative" }}>
                mute is true ;; bg blue
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>

        <div className="mixer">
          <Button
            variant="small"
            onClick={() => {
              if (selectTab === "stream") {
                setSelectTab("mixer");
              }
            }}
            icon={<Controls />}
          ></Button>
        </div>
      </div>
    </ControlPanel>
  );
}
