import styled from "styled-components";

export default function Button({
  style,
  children,
  onClick,
  variant,
  icon,
  className,
}) {
  return (
    <StyledButton
      {...style}
      onClick={onClick}
      variant={variant}
      className={className}
    >
      {icon}
      {children}
    </StyledButton>
  );
}

const StyledButton = styled.button.attrs((props) => ({
  className: props.className,
}))`
  appearance: none;
  border: 1px solid #000;
  background: #fff;
  color: #000;
  cursor: pointer;
  font-size: 1.5rem;

  min-width: ${(p) => {
    if (p.variant === "big") {
      return "10em";
    }
    if (p.variant === "medium") {
      return "200px";
    }
    if (p.variant === "small") {
      return "auto";
    }
    if (p.variant === "tiny") {
      return "1em";
    }

    if (p.variant === "custom") {
      return;
    }
  }};

  min-height: ${(p) => {
    if (p.variant === "big") {
      return "3em";
    }
    if (p.variant === "medium") {
      return "100px";
    }
    if (p.variant === "small") {
      return "auto";
    }
    if (p.variant === "tiny") {
      return "1em";
    }

    if (p.variant === "custom") {
      return;
    }
  }};

  border-radius: 4px;
  box-shadow: 0 3px black;
  font-family: "Work Sans";
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #eee;
  }
`;
