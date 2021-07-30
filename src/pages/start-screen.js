import styled from "styled-components";
import useLocalStorage from "react-use-localstorage";
import { useEffect } from "react";
import axios from "axios";

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

export default function StartScreen({ send }) {
  const [identity, setIdentity] = useLocalStorage("identity");

  useEffect(() => {
    if (identity) {
      send("SET_IDENTITY", { identity });
    } else {
      return axios
        .post(`${process.env.REACT_APP_PEER_SERVER}/session/new`)
        .then((result) => {
          setIdentity(result.data.identity);
          send("SET_IDENTITY", { identity: result.data.identity });
        });
    }
  }, []);
  return (
    <StyledPage>
      <div>
        <p>Fetching identity from server...</p>
      </div>
    </StyledPage>
  );
}
