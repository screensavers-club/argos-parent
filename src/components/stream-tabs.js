import styled from "styled-components";

let tabs;

const Tabs = styled.div`
  display: flex;
  justify-content: center;
  margin: auto;
  margin-top: 25px;
  padding: auto;

  > div {
    border: 1px solid black;
    padding: 10px 50px;

    &:nth-child(n + 2) {
      margin-left: -1px;
    }

    &:hover {
      z-index: 1;
      border-bottom: 5px solid black;
      margin-bottom: -5px;
      background: #ddd;
      cursor: pointer;
    }
  }
`;

export default function StreamTabs({ setSelectTab }) {
  return (
    <Tabs>
      {(tabs = [
        { tab: "stream" },
        { tab: "layout" },
        // { tab: "monitor" },
        // { tab: "out" },
        { tab: "mixer" },
      ]).map(function ({ tab }, i) {
        let key = `key_${i}`;
        return (
          <div
            key={key}
            onClick={() => {
              setSelectTab(tab);
            }}
          >
            {tab}
          </div>
        );
      })}
    </Tabs>
  );
}
