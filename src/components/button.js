import styled from "styled-components";

export default function Button({
  style,
  children,
  onClick,
  variant,
  type,
  icon,
  className,
}) {
  return (
    <StyledButton
      {...style}
      onClick={onClick}
      variant={variant}
      type={type}
      icon={icon}
      className={className}
    >
      <div>
        {icon}
        {children}
      </div>
    </StyledButton>
  );
}

const StyledButton = styled.button.attrs((props) => ({
  className: props.className,
}))`
  display: block;

  appearance: none;
  text-align: left;
  font-style: normal;
  border: none;
  color: ${(p) => (p.type === "tertiary" ? "#5736FD" : "#fff")};
  cursor: pointer;
  justify-content: flex-start;
  align-items: flex-end;

  background: ${(p) => {
    switch (p.type) {
      case "primary":
        return "#5736FD";

      case "secondary":
        return "#AC4545";

      case "tertiary":
        return "#fff";

      default:
        return "#292933";
    }
  }};

  width: ${(p) => {
    switch (p.variant) {
      case "navigation":
        return "10rem";

      case "small":
        return "130px";

      case "delay":
        return "90px";

      default:
        return "160px";
    }
  }};

  height: ${(p) => {
    switch (p.variant) {
      case "delay":
        return "35px";

      case "small":
        return "50px";

      default:
        return "50px";
    }
  }};

  border-radius: ${(p) => {
    switch (p.variant) {
      default:
        return "50px";
    }
  }};

  font-weight: normal;

  font-size: ${(p) => {
    switch (p.variant) {
      case "small":
        return "12px";
      case "delay":
        return "12px";
      default:
        return "1rem";
    }
  }};

  > div {
    display: flex;
    justify-content: ${(p) =>
      p.type === "tertiary" || p.variant === "small" ? "center" : "flex-start"};
    align-items: center;
    margin: auto 0;

    width: ${(p) => {
      switch (p.variant) {
        default:
          return "100%";
      }
    }};

    margin: ${(p) => {
      switch (p.variant) {
        default:
          return 0;
      }
    }};

    svg {
      stroke-width: 1.5px;
      padding-top: ${(p) => (p.variant === "navigation" ? "0" : "1px")};
      padding-left: ${(p) =>
        p.variant === "navigation"
          ? "15px"
          : p.variant === "delay"
          ? "5px"
          : p.variant === "small"
          ? "5px"
          : "20px"};
      padding-right: ${(p) =>
        p.variant === "navigation"
          ? "10px"
          : p.variant === "delay"
          ? "5px"
          : p.variant === "small"
          ? "5px"
          : "15px"};
      font-size: ${(p) => {
        switch (p.variant) {
          case "navigation":
            return "25px";

          default:
            return "20px";
        }
      }};
    }
  }

  :hover {
    stroke: #292933;
    color: #292933;
    background: white;
  }

  :active {
    stroke: #5736fd;
    color: #5736fd;
    background: white;
  }

  :focus {
    stroke: #5736fd;
    color: #5736fd;
    background: white;
  }
`;
