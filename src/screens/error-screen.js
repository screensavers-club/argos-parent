import styled from "styled-components";
import Button from "../components/button";

const StyledPage = styled.div`
  display: flex;
  margin: auto;
  padding: auto;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  min-height: 100%;

  div.errorMessage {
    margin-top: 10%;
    text-align: center;
  }
`;

export default function ErrorScreen({ send, context }) {
  return (
    <StyledPage>
      <div className="errorMessage">
        <h3>Error</h3>
        <p>{context.error.message}</p>
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
