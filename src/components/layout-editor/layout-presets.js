import axios from "axios";
import { Download, Upload } from "react-ikonate";
import { DataPacket_Kind } from "livekit-client";
import styled from "styled-components";

export default function LayoutPresetsControl({ room, bumpActiveLayout }) {
  return (
    <PresetsBar>
      <label>Layout Presets</label>
      {[0, 1, 2, 3, 4, 5, 6, 7].map((n, i) => {
        return (
          <Slot key={`slot_${n}`}>
            <label>Slot {n + 1}</label>
            <button
              onClick={() => {
                axios.post(
                  `${process.env.REACT_APP_PEER_SERVER}/${room.name}/layout/save/${n}`
                );
              }}
            >
              <Download />
            </button>
            <button
              onClick={() => {
                axios
                  .post(
                    `${process.env.REACT_APP_PEER_SERVER}/${room.name}/layout/load/${n}`
                  )
                  .then(() => {
                    const payload = JSON.stringify({
                      action: "LAYOUT",
                    });
                    const encoder = new TextEncoder();
                    const data = encoder.encode(payload);

                    room.localParticipant.publishData(
                      data,
                      DataPacket_Kind.RELIABLE
                    );
                    bumpActiveLayout();
                  });
              }}
            >
              <Upload />
            </button>
          </Slot>
        );
      })}
    </PresetsBar>
  );
}

const PresetsBar = styled.div`
  width: calc(100% - 32px);
  height: 66px;
  position: absolute;
  left: 16px;
  bottom: 16px;
  background: #343439;
  box-sizing: border-box;
  color: #fff;
  border-radius: 8px 8px 15px 15px;
  display: flex;
  justify-content: stretch;
  overflow: hidden;

  > label {
    display: flex;
    width: 8rem;
    font-size: 0.8rem;
    text-transform: uppercase;
    justify-content: center;
    align-items: center;
    color: #aaaaae;
  }
`;

const Slot = styled.div`
  flex-grow: 1;
  border-left: 1px solid #222225;
  display: flex;
  flex-wrap: wrap;

  button {
    display: flex;
    width: 50%;
    height: 50%;
    font-size: 0.9rem;
    text-transform: uppercase;
    justify-content: center;
    align-items: center;
    border-radius: 0;
    border: 0;
    border-bottom: 1px solid #222225;
    appearance: none;
    outline: none;
    background: transparent;
    color: #aaaaae;
    cursor: pointer;

    & + button {
      border-left: 1px solid #222225;
    }

    &:hover {
      color: #fff;
      background: #aaaaae;
    }
  }

  label {
    display: flex;
    width: 100%;
    height: 50%;
    order: 3;
    font-size: 0.8rem;
    text-transform: uppercase;
    justify-content: center;
    align-items: center;
  }
`;
