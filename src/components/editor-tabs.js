import styled from "styled-components";
import { Grid, Radio } from "react-ikonate";

const Tabs = styled.div`
  flex-grow: 1;
  display: flex;
  justify-content: center;

  > div {
    display: flex;
    justify-content: center;
    background: #292933;
    border-radius: 50px;
    height: 50px;
    overflow: hidden;

    > div {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 8px 16px 8px 8px;
      cursor: pointer;
      font-size: 1rem;
      color: white;
      border-right: 1px solid #191920;

      &:first-child {
        padding-left: 16px;
      }

      &:last-child {
        padding-right: 24px;
      }

      svg {
        margin-right: 10px;
        font-size: 1.5em;
        stroke-width: 1.5px;
      }

      :last-child {
        border-right: none;
      }

      &:hover {
        background: #393944;
      }

      &.selected {
        background: #5736fd;
      }
    }
  }
`;

export default function EditorTabs({ setSelectTab, selectedTab }) {
  return (
    <Tabs>
      <div className="tabsContainer">
        {[
          { tab: "Stream controls", icon: <Radio />, state: "stream-controls" },
          { tab: "Monitor layout", icon: <Grid />, state: "monitor-layout" },
        ].map(function ({ tab, icon, state }, i) {
          let key = `key_${i}`;
          return (
            <div
              key={key}
              onClick={() => {
                setSelectTab(state);
              }}
              className={selectedTab === state ? "selected" : ""}
            >
              {icon}
              {tab}
            </div>
          );
        })}
      </div>
    </Tabs>
  );
}
