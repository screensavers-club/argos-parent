import styled from "styled-components";

export default function Card({
  style,
  children,
  onClick,
  icon,
  gradient,
  participants,
  variant,
}) {
  return (
    <StyledButton
      {...style}
      onClick={onClick}
      icon={icon}
      gradient={gradient}
      variant={variant}
    >
      <div>
        <span>
          {icon}
          {participants}
        </span>
        {children}
      </div>
    </StyledButton>
  );
}

const StyledButton = styled.button`
  position: relative;
  display: inline-flex;
  cursor: pointer;
  align-items: flex-end;
  justify-content: ${(p) => (p.variant === "create" ? "center" : "flex-start")};
  appearance: none;
  background: ${(p) => p.gradient};
  border: none;
  color: #fff;
  min-width: 380px;
  width: 25%;
  height: 260px;
  border-radius: 15px;
  text-align: left;
  font-style: normal;
  font-weight: 600;
  font-size: 24px;
  text-shadow: rgba(0, 0, 0, 0.2) 0 2px 5px;
  box-shadow: 0 4px 4px #252529;

  > div {
    display: flex;
    justify-content: ${(p) =>
      p.variant === "create" ? "center" : "flex-start"};
    align-items: center;
    width: ${(p) => (p.variant === "create" ? "100%" : "50%")};
    margin: ${(p) => (p.variant === "create" ? "10px 0" : "0 0 10px 10px;")};

    span {
      position: absolute;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      font-size: 10px;
      top: ${(p) => (p.variant === "create" ? "50%" : "10px")};
      right: ${(p) => (p.variant === "create" ? "50%" : "10px")};
      transform: ${(p) =>
        p.variant === "create" ? "translate(50%, -60%)" : "none"};
    }
    svg {
      stroke-width: 1.5;
      font-size: ${(p) => (p.variant === "create" ? "56px" : "14px")};
      margin-right: ${(p) => (p.variant === "create" ? "0" : "5px")};
    }
  }
`;
