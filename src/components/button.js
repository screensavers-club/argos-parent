import styled from "styled-components";

export default function Button({ style, children, onClick, variant }) {
  return (
    <StyledButton {...style} onClick={onClick} variant={variant}>
      {children}
    </StyledButton>
  );
}

const StyledButton = styled.button`
  appearance: none;
  border: 1px solid #000;
  background: #fff;
  color: #000;
  cursor: pointer;
  font-size: 1.5rem;
  min-width: ${(p) => (p.variant === "big" ? "10em" : "5em")};
  min-height: ${(p) => (p.variant === "big" ? "3em" : "auto")};
  border-radius: 4px;
  box-shadow: 0 3px black;
  font-family: "Work Sans";

  &:hover {
    background: #ddd;
  }
`;
