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
  height: 250px;
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

  div.ids {
    position: absolute;
    height: 100px;
    width: 20px;
    right: 0;
    top: 0;
    transform: translate(100%, 0);

    > div {
      position: relative;
      border: 1px solid black;
      height: 20px;
      width: 20px;

      :hover {
        cursor: pointer;
      }
    }
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
    name: "performer 1",
    id: "p1",
    vol: 0.5,
    solo: false,
    mute: false,
    toggleMixer: false,
    visible: true,
  },
  {
    name: "performer 2",
    id: "p2",
    vol: 0.5,
    solo: false,
    mute: false,
    toggleMixer: false,
    visible: false,
  },
  {
    name: "performer 3",
    id: "p3",
    vol: 0.5,
    solo: false,
    mute: false,
    toggleMixer: false,
    visible: false,
  },
  {
    name: "performer 4",
    id: "p4",
    vol: 0.5,
    solo: false,
    mute: false,
    toggleMixer: false,
    visible: false,
  },
  {
    name: "performer 5",
    id: "p5",
    vol: 0.5,
    solo: false,
    mute: false,
    toggleMixer: false,
    visible: false,
  },
];

export default function AudioControls({ selectTab, setSelectTab }) {
  let [control, setControl] = useState(input);
  let [activeControl, setActiveControl] = useState(0);

  // console.log(control);

  return (
    <ControlPanel>
      <label>audio controls</label>
      <div>
        <div>
          <div>
            <label>{control[activeControl].name}</label>

            <Slider
              value={control[activeControl].vol}
              onChange={(value) => {
                let _control = control.slice(0);
                _control[activeControl].vol = value;
                setControl(_control);
              }}
            />
          </div>
        </div>
      </div>

      <div className="ids">
        {control.map((data, i) => {
          return (
            <TogglePerformers
              id={data.id}
              value={control.visible}
              onChange={(value) => {
                setActiveControl(i);
              }}
            />
          );
        })}
      </div>
    </ControlPanel>
  );
}

function TogglePerformers({ value, id, onChange }) {
  return (
    <div>
      <button
        onClick={() => {
          onChange(!value);
        }}
      >
        {id}
      </button>
    </div>
  );
}

/* <label>audio controls</label>
      <div className="volumeSlider">
        <ControlledRangeDisableAcross vertical />
      </div>
      <div className="buttons">
        <div className="solo-mute">
          <Button variant="tiny">S</Button>
          <Button variant="tiny">M</Button>
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
      </div> */
