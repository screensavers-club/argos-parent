import styled from "styled-components";

export default function Equalizer({ toggleEQ, control, setControl }) {
  return (
    <Window>
      {control[toggleEQ].eq.map((props, i) => {
        let key = `key${i}`;
        return (
          <div className="eqControl">
            <span>{control[toggleEQ].id}</span>
            <span>{props.type}</span>
            <div className="visualiser"></div>
            <div className="amplitudeControl">
              <span>amplitude</span>
              <input
                style={{ width: "100%" }}
                value={control[toggleEQ].eq[2].amp}
                onChange={(value) => {
                  let _control = control.slice(0);
                  _control[toggleEQ].eq[2].amp = value.target.value;
                  // console.log(value.nativeEvent.data);
                  setControl(_control);
                  console.log(control);
                }}
              />
            </div>
          </div>
        );
      })}
      <div></div>
    </Window>
  );
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

  div.eqControl {
    border: 1px solid black;
    width: 10%;
    text-align: center;
    padding: 10px;
  }

  div.amplitudeControl {
    border: 1px solid black;
    display: flex;
    > span {
      margin-right: 10px;
    }
  }
`;
