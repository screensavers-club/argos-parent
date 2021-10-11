import reactDom from "react-dom";
import styled from "styled-components";
import { Controls, Grid, Radio } from "react-ikonate";

let tabs;

const Tabs = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;

  > div {
    display: flex;
    justify-content: center;
    background: #434349;
    border-radius: 50px;
    width: 510px;
    height: 50px;
    padding: 0 10px;

    > div {
      width: 170px;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 10px;

      font-size: 14px;
      color: white;
      border-right: 1px solid #252529;

      svg {
        margin-right: 10px;
        font-size: 18px;
        stroke-width: 1.5px;
      }

      :last-child {
        border-right: none;
      }

      :hover {
        cursor: pointer;
        background: grey;
      }
    }
  }
`;

export default function StreamTabs({ setSelectTab, selectedTab }) {
  return (
    <Tabs>
      <div className="tabsContainer">
        {(tabs = [
          { tab: "Stream controls", icon: <Radio /> },
          { tab: "Monitor layout", icon: <Grid /> },
          { tab: "Audio mixer", icon: <Controls /> },
        ]).map(function ({ tab, icon }, i) {
          let key = `key_${i}`;
          return (
            <div
              key={key}
              onClick={() => {
                setSelectTab(tab);
              }}
              className={selectedTab === tab ? "selected" : ""}
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
