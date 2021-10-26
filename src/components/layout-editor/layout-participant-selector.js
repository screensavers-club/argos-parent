import { useParticipant } from "livekit-react";
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
  activeLayout,
}) {
  let { metadata } = useParticipant(participant);

  const nickname = JSON.parse(metadata || "{}")?.nickname;

  return (
    <Selector
      active={active}
      onClick={() => {
        send("SET_EDITING_LAYOUT", { sid: participant.sid });
        getLayoutState(room.name, nickname).then(({ data }) => {
          if (data.layout === null) {
            let _l = setLayoutState(room.name, nickname, {
              ...VideoLayout.Default,
              layout: "Default",
            });
          }
        });
      }}
    >
      <User />
      <span>{nickname}</span>
      {activeLayout && <img src={activeLayout.icon} alt="Layout icon" />}
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
