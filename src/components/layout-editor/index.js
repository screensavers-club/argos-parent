import styled from "styled-components";

import NoChildNodes from "../no-child-nodes";
import LayoutEditorMain from "./layout-editor-main";
import LayoutPresetsControl from "./layout-presets";

export default function LayoutEditor({
  room,
  context,
  send,
  participants /* filtered child participants only */,
}) {
  return participants.length === 0 ? (
    <NoChildNodes />
  ) : (
    <>
      <GridContainer>
        <LayoutEditorMain
          room={room}
          context={context}
          send={send}
          participants={participants}
        />
      </GridContainer>
      <LayoutPresetsControl room={room} />
    </>
  );
}

const GridContainer = styled.div`
  display: block;
  position: absolute;
  top: 82px;
  bottom: 16px;
  width: calc(100% - 32px);
  overflow-y: scroll;
`;
