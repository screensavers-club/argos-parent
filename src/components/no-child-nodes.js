import { Retweet } from "react-ikonate";
import styled from "styled-components";

export default function NoChildNodes() {
  return (
    <Notice>
      <Retweet />
      <h1>Waiting for child nodes to join the room.</h1>
    </Notice>
  );
}

const Notice = styled.div`
  width: 100%;
  height: 500px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;

  svg {
    font-size: 3em;
    animation: loading ease 3s infinite;
  }

  h1 {
    color: white;
    text-align: center;
    font-weight: 300;
  }

  @keyframes loading {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }
`;
