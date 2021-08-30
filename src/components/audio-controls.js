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

    > button.soloed {
      background: #faff00;
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

  div.ids {
    position: absolute;
    height: 100px;
    width: 20px;
    right: 0;
    top: 0;
    transform: translate(100%, 0);

    button {
      background: none;
      border: 1px solid black;
      outline: none;
      text-align: center;
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
  },
  {
    name: "performer 2",
    id: "p2",
    vol: 0.5,
    solo: false,
    mute: false,
  },
  {
    name: "performer 3",
    id: "p3",
    vol: 0.5,
    solo: false,
    mute: false,
  },
  {
    name: "performer 4",
    id: "p4",
    vol: 0.5,
    solo: false,
    mute: false,
  },
  {
    name: "performer 5",
    id: "p5",
    vol: 0.5,
    solo: false,
    mute: false,
  },
];

export default function AudioControls({ selectTab, setSelectTab }) {
  let [control, setControl] = useState(input);
  let [activeControl, setActiveControl] = useState(0);

  // console.log(control);

  return (
    <ControlPanel>
      <label>audio controls</label>
      <label>{control[activeControl].name}</label>
      <div className="panel">
        <ControlButtons
          activeControl={activeControl}
          setActiveControl={setActiveControl}
          soloValue={control[activeControl].solo}
          muteValue={control[activeControl].mute}
          setSelectTab={setSelectTab}
          control={control}
          setControl={setControl}
        />
      </div>

      <div className="ids">
        {control.map((data, i) => {
          return (
            <TogglePerformers
              id={data.id}
              onChange={() => {
                setActiveControl(i);
              }}
            />
          );
        })}
      </div>
    </ControlPanel>
  );
}

function ControlButtons({
  activeControl,
  control,
  setControl,
  soloValue,
  muteValue,
  setSelectTab,
}) {
  return (
    <div className="buttons">
      <Slider
        style={{ gridColumn: "1 / span 1", gridRow: "1 / span 2" }}
        vertical
        value={control[activeControl].vol}
        onChange={(value) => {
          let _control = control.slice(0);
          _control[activeControl].vol = value;
          setControl(_control);
        }}
      />

      <Button
        className={`solo ${soloValue === true ? "soloed" : ""}`}
        variant="tiny"
        onClick={() => {
          let _control = control.slice(0);
          _control[activeControl].solo = !soloValue;
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
  );
}

function TogglePerformers({ id, onChange }) {
  return (
    <div>
      <button
        onClick={() => {
          onChange();
        }}
      >
        {id}
      </button>
    </div>
  );
}
