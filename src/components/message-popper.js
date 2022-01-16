import styled from "styled-components";

export default function Popper({ message }) {
  return message && <PopperDiv>{message}</PopperDiv>;
}

const PopperDiv = styled.div`
  position: fixed;
  bottom: 100px;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #5736fd;
  color: #fff;
  padding: 8px 15px;
  border-radius: 15px;
  font-size: 1rem;
  text-align: center;
  max-width: 30em;
`;
