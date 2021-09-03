import styled from "styled-components";

export default function Equalizer() {
  return (
    <Window>
      {props.map((a, i) => {
        let key = `key${i}`;
        return (
          <div>
            <span>{a.type}</span>
          </div>
        );
      })}
      <div></div>
    </Window>
  );
}

const Window = styled.div``;
