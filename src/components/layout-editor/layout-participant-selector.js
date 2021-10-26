import { useParticipant } from "livekit-react";
import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";
import { User } from "react-ikonate";
import styled from "styled-components";
import VideoLayout from "../../util/video-layouts";

export default function LayoutParticipantSelector({
  send,
  participant,
  active,
  room,
  setLayoutState,
  getLayoutState,
  setActiveLayout,
}) {
  let { metadata } = useParticipant(participant);

  const nickname = JSON.parse(metadata || "{}")?.nickname;
  const [thisLayout, setThisLayout] = useState(null);
  const timeoutRef = useRef();

  useEffect(() => {
    if (timeoutRef.current) {
      window.clearInterval(timeoutRef.current);
    }
    timeoutRef.current = window.setInterval(() => {
      if (nickname) {
        getLayoutState(room.name, nickname).then(({ data }) => {
          setThisLayout(data.layout);
        });
      }
    }, 2000);
    return () => {
      window.clearInterval(timeoutRef.current);
    };
  }, [nickname]);

  return (
    <Selector
      active={active}
      onClick={() => {
        send("SET_EDITING_LAYOUT", { sid: participant.sid });
        getLayoutState(room.name, nickname).then(({ data }) => {
          if (data.layout === null) {
            setLayoutState(room.name, nickname, {
              ...VideoLayout.Default,
              layout: "Default",
            }).then(({ data }) => {
              setActiveLayout(data.layout);
              setThisLayout(data.layout);
            });
          } else {
            setActiveLayout(data.layout);
            setThisLayout(data.layout);
          }
        });
      }}
    >
      <User />
      <span>{nickname}</span>
      {thisLayout && <img src={thisLayout.icon} alt="Layout icon" />}
    </Selector>
  );
}

const Selector = styled.button`
  display: flex;
  border: 0;
  appearance: none;
  outline: none;
  background: ${(p) => (p.active ? "#5736FD" : "transparent")};
  color: #fff;
  font-size: 1rem;
  padding: 8px;
  width: 100%;
  text-align: left;
  align-items: center;
  cursor: pointer;

  > svg {
    font-size: 1.2em;
    margin-right: 8px;
  }

  span {
    flex-grow: 1;
  }

  > img {
    width: 30px;
  }

  &:hover {
    background: ${(p) => (p.active ? "#5736FD" : "33333f")};
  }
`;
