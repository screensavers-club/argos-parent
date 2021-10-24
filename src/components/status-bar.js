import styled from "styled-components";
import { useEffect, useState } from "react";
import { Calendar, Time, Folder, Disc } from "react-ikonate";
import moment from "moment";

export default function StatusBar({ context, room, version }) {
  let [time, setTime] = useState(moment());

  function renderTime() {
    return (
      <>
        <Calendar /> {time.format("ddd DD MMM")}
        <Time /> {time.format("hh:mm:ssA")}
      </>
    );
  }

  useEffect(() => {
    setTimeout(() => {
      setTime(moment());
    }, 1000);
  }, [time]);

  return (
    <Bar color={context.color}>
      <div className="left">
        <div className="roomColour" />
        {room ? room : "not connected"}
      </div>
      <div className="right">
        <Disc /> v{version} {renderTime()}
      </div>
    </Bar>
  );
}

const Bar = styled.div`
  font-family: "Rubik", sans-serif;
  font-size: 0.75rem;
  text-transform: uppercase;
  font-weight: 300;
  pointer-events: none;
  user-select: none;
  display: flex;
  background: #111113;
  color: white;
  align-items: center;
  padding: 4px 12px 4px 8px;
  box-sizing: border-box;
  height: 35px;
  margin: 0;

  div.roomColour {
    background: ${(p) =>
      p.color.length > 0
        ? `linear-gradient(135deg, ${p.color[0]}, ${p.color[1]})`
        : "#292933"};
    width: 12px;
    height: 12px;
    margin-right: 10px;
    border-radius: 50%;
  }

  div.left {
    width: 50%;
    display: flex;
    align-items: center;
  }

  div.right {
    width: 50%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  svg {
    stroke-width: 1.5px;
    margin: 0 10px 0 20px;
    font-size: 14px;
  }
`;
