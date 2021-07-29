import styled from "styled-components";

const StyledPage = styled.div`
  width: 100%;
  height: 100%;
  display: block;

  > div {
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
  }
`;

export default function StartScreen() {
  return (
    <StyledPage>
      <div>
        <p>Fetching identity from server...</p>
      </div>
    </StyledPage>
  );
}
