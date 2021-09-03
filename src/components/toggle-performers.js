import styled from "styled-components";

const IdColumn = styled.div`
  position: absolute;
  height: 100px;
  width: 20px;
  right: 0;
  top: 0;
  transform: translate(-200%, 100%);
  z-index: 0;

  button {
    background: none;
    border: 1px solid black;
    outline: none;
    text-align: center;
  }

  button.isPressed {
    background: grey;
  }
`;

export default function TogglePerformers({
  control,
  activeControl,
  setActiveControl,
}) {
  return (
    <IdColumn control={control} activeControl={activeControl}>
      {control.map((data, i) => {
        return (
          <div>
            <button
              className={`ids ${i === activeControl ? "isPressed" : ""}`}
              onClick={() => {
                setActiveControl(i);
              }}
            >
              {data.id}
            </button>
          </div>
        );
      })}
    </IdColumn>
  );
}
