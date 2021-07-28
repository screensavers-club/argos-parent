import styled from "styled-components";
import Button from "../components/button";

const StyledPage = styled.div`
  display: block;
  margin: auto;
  padding: auto;

  div.errorMessage {
    margin-top: 10%;
    text-align: center;
  }

  Button {
    position: absolute;
    top: 300px;
    left: 50%;
    transform: translate(-50%, 0);
    width: 200px;
    height: 100px;
  }
`;

export default function Start({ resetClick }) {
  return (
    <StyledPage>
      <div className="requestServer"></div>
      {/* <Button onClick={resetClick}>Back</Button> */}
    </StyledPage>
  );
}
