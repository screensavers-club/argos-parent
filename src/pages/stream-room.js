import styled from "styled-components";
import Button from "../components/button";

const StyledPage = styled.div`
  div.roomCreated {
    text-align: center;
    font-size: 1.5rem;
    margin-top: 10%;
  }

  Button {
    position: absolute;
    top: 300px;
    left: 50%;
    transform: translate(-50%, 0);
    height: 100px;
    width: 200px;
  }
`;

export default function StreamRoom({ tabs, context, send }) {
  return (
    <StyledPage>
      <div className="streamTabs">
        {(tabs = [
          { tab: "stream" },
          { tab: "monitor" },
          { tab: "out" },
          { tab: "Tab 4" },
        ]).map(function ({ tab }, i) {
          let key = `key_${i}`;
          return <div key={key}>{tab}</div>;
        })}
      </div>

      <Button
        onClick={() => {
          send("RESET");
        }}
      >
        Back
      </Button>
    </StyledPage>
  );
}
