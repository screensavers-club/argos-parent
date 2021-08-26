import { useState, useEffect } from "react";
import styled from "styled-components";
import Button from "../components/button";
import { useRoom } from "livekit-react";
import { ShowParticipants } from "../components/show-participants";
import AudioControls from "../components/audio-controls";

const StyledPage = styled.div`
  position: relative;
  display: block;

  div.roomCreated {
    text-align: center;
    font-size: 1.5rem;
    margin-top: 10%;
  }

  div.streamTabs {
    display: flex;
    justify-content: center;
    margin: auto;
    margin-top: 25px;
    padding: auto;

    > div {
      border: 1px solid black;
      padding: 10px 50px;

      &:nth-child(n + 2) {
        margin-left: -1px;
      }

      &:hover {
        z-index: 1;
        border-bottom: 5px solid black;
        margin-bottom: -5px;
        background: #ddd;
        cursor: pointer;
      }
    }
  }

  table.participants {
    border: 1px solid black;
    padding: 25px;

    caption {
      border: 1px solid black;
      border-bottom: 2px solid black;
      font-size: 18px;
      font-weight: normal;
    }

    tr.id {
      min-width: 200px;
    }

    thead {
      > div {
        border-top: 2px solid black;
        padding-top: 10px;
        margin-bottom: 10px;
      }
    }
    tbody {
      > div {
        padding-top: 10px;
        margin-bottom: 10px;
        border-top: 2px solid black;
      }
    }
  }

  div.stream {
    position: relative;
    display: flex;
    justify-content: center;
    border: 1px solid black;
    padding: 10px;
    margin: 25px;

    div.userVideos {
      position: relative;

      border: 1px solid red;
      min-width: 50%;
      display: flex;
    }
  }

  div.button {
    position: absolute;
    left: 25px;
    top: 0;
    margin: auto;
    padding: auto;
  }
`;

export default function StreamRoom({
  state,
  tabs,
  context,
  send,
  parents,
  performers,
}) {
  const { room, connect } = useRoom();
  const [selectTab, setSelectTab] = useState("stream");

  useEffect(() => {
    connect(`${process.env.REACT_APP_LIVEKIT_SERVER}`, context.token);
  });

  return (
    <StyledPage>
      <div className="button">
        <Button
          onClick={() => {
            send("RESET");
          }}
          variant="small"
        >
          End Call
        </Button>
      </div>
      <div className="streamTabs">
        {(tabs = [
          { tab: "stream" },
          { tab: "monitor" },
          { tab: "out" },
          { tab: "mixer" },
        ]).map(function ({ tab }, i) {
          let key = `key_${i}`;
          return (
            <div
              key={key}
              onClick={() => {
                setSelectTab(tab);
                console.log(tab);
              }}
            >
              {tab}
            </div>
          );
        })}
      </div>

      {(function () {
        console.log(selectTab);
        switch (selectTab) {
          case "stream":
            return (
              <div className="stream">
                <table className="participants">
                  <caption>Peers</caption>

                  <thead>
                    <div>
                      {parents.map(({ id, status }) => {
                        return (
                          <tr className="id">
                            {status === "host" ? (
                              <th>
                                <div
                                  style={{
                                    background: "lime",
                                    width: "1em",
                                    height: "1em",
                                    borderRadius: "50%",
                                    marginRight: "10px",
                                  }}
                                ></div>
                              </th>
                            ) : (
                              <th></th>
                            )}
                            <td>{id}</td>
                          </tr>
                        );
                      })}
                    </div>
                  </thead>
                  <tbody>
                    <div>
                      {performers.map(({ id }) => {
                        return (
                          <tr className="id">
                            <th></th>
                            <td>{id}</td>
                          </tr>
                        );
                      })}
                    </div>
                  </tbody>
                </table>

                <div className="userVideos">
                  <ShowParticipants
                    participants={[
                      { username: "john", track: "aaa" },
                      { username: "john", track: "aaa" },
                      { username: "john", track: "aaa" },
                      { username: "john", track: "aaa" },
                      { username: "john", track: "aaa" },
                      { username: "john", track: "aaa" },
                      { username: "john", track: "aaa" },
                      { username: "john", track: "aaa" },
                      { username: "john", track: "aaa" },
                      { username: "john", track: "aaa" },
                    ]}
                  />
                </div>
              </div>
            );

          case "mixer":
            return <div>this is mixer</div>;
        }
      })()}
      <AudioControls selectTab={selectTab} setSelectTab={setSelectTab} />
    </StyledPage>
  );
}
