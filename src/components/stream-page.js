import AudioControls from "../components/audio-controls";
import VideoControls from "../components/video-controls";
import styled from "styled-components";
import React, { useState } from "react";

const Stream = styled.div`
  z-index: 0;
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
`;

export default function StreamPage({
  parents,
  performers,
  selectTab,
  setSelectTab,
  control,
  setControl,
  activeControl,
  setActiveControl,
  context,
  send,
}) {
  // useRoom();
  return (
    <div className="stream">
      <table className="participants">
        <caption>Peers</caption>

        <thead>
          <div>
            {parents.map(({ id, status }, i) => {
              let key = `key_${i}`;
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
                  <td key={key}>{id}</td>
                </tr>
              );
            })}
          </div>
        </thead>
        <tbody>
          <div>
            {performers.map(({ name, audioTracks, videoTracks }, i) => {
              let _key = `_key_${i}`;
              return (
                <tr className="id">
                  <th></th>
                  <td key={_key}>
                    [{audioTracks?.size}] {name}
                  </td>
                </tr>
              );
            })}
          </div>
        </tbody>
      </table>

      <div className="userVideos">
        {/* <ShowParticipants participants={performers} /> */}
      </div>
      <div className="controlPanel">
        <label>{control[activeControl].name}</label>
        <VideoControls style={{ position: "relative" }} />

        <AudioControls
          selectTab={selectTab}
          setSelectTab={setSelectTab}
          activeControl={activeControl}
          control={control}
          setControl={setControl}
          soloValue={control[activeControl].solo}
          muteValue={control[activeControl].mute}
        />
      </div>
    </div>
  );
}
