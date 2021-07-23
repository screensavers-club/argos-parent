import styled from "styled-components";

export default function Button({ style, children }) {
  return <StyledButton {...style}>{children}</StyledButton>;
}

const StyledButton = styled.button`
  appearance: none;
  border: 1px solid #000;
  background: #000;
  color: #fff;
  cursor: pointer;
  font-size: 1.5rem;
  min-width: 5em;
  border-radius: 3px;
  font-family: "Work Sans";

  &:hover {
    background: #333;
  }
`;
