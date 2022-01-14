import styled from "styled-components";
import { Save, Shift } from "react-ikonate";
import axios from "axios";
import Button from "./button";

function download(filename, text) {
  var element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(text)
  );
  element.setAttribute("download", filename);

  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

function processFile(e) {
  if (e.target.files.length !== 1) {
    return;
  }
  const reader = new FileReader();

  reader.onload = (e) => {
    const str = e.target.result;
    const roomState = JSON.parse(str);

    const keysAreValid = Object.keys(roomState).reduce((p, c) => {
      return p && ["mix", "mixSlots", "layout", "layoutSlots"].indexOf(c) > -1;
    }, true);

    if (!keysAreValid) {
      alert("The selected file is not a valid room preset file.");
      return false;
    }
  };

  reader.readAsText(e.target.files[0]);
}

export default function RoomSaveLoad({ room }) {
  return (
    <SaveLoadRoomDiv>
      <label>
        Show
        <br />
        Presets
        <span>
          Use the save/load buttons to download presets you have set up to your
          computer, and apply it at a later time. You may load presets into a
          different room and it would still work provided the child node names
          are kept consistent.
        </span>
      </label>
      <Button
        variant="icon"
        onClick={() => {
          axios
            .get(`${process.env.REACT_APP_PEER_SERVER}/${room.name}/state`)
            .then(({ data }) => {
              let roomState = data.roomState;
              delete roomState.name;
              delete roomState.passcode;
              download(`${room.name}.json`, JSON.stringify(roomState));
            });
        }}
      >
        <Save />
      </Button>

      <Button
        variant="icon"
        onClick={() => {
          document.getElementById("file_input").click();
        }}
      >
        <Shift />
      </Button>
      <input
        type="file"
        id="file_input"
        style={{ display: "none" }}
        onChange={(e) => {
          processFile(e);
        }}
        accept="application/json"
      />
    </SaveLoadRoomDiv>
  );
}

const SaveLoadRoomDiv = styled.div`
  flex-grow: 0;
  display: flex;
  align-items: center;
  gap: 15px;

  label {
    color: white;
    text-transform: uppercase;

    &:hover span {
      display: block;
    }

    span {
      text-transform: none;
      display: none;
      position: absolute;
      width: 250px;
      background: #000;
      padding: 8px;
      border-radius: 5px;
      top: 60px;
      line-height: 1.3;
    }
  }
`;
