import { useEffect, useState } from "react";
import styled from "styled-components";
import { Save, Shift } from "react-ikonate";
import axios from "axios";
import Button from "./button";
import Popper from "./message-popper";

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

export default function RoomSaveLoad({ room }) {
  const [confirmLoad, setConfirmLoad] = useState();

  useEffect(() => {
    if (confirmLoad) {
      window.setTimeout(() => {
        setConfirmLoad(null);
      }, 2500);
    }
  }, [confirmLoad]);

  function processFile(e) {
    if (e.target.files.length !== 1) {
      return;
    }
    const reader = new FileReader();

    reader.onload = (e) => {
      const str = e.target.result;
      const roomState = JSON.parse(str);

      const keysAreValid = Object.keys(roomState).reduce((p, c) => {
        return (
          p && ["mix", "mixSlots", "layout", "layoutSlots"].indexOf(c) > -1
        );
      }, true);

      if (!keysAreValid) {
        alert("The selected file is not a valid room preset file.");
        return false;
      }

      axios
        .post(`${process.env.REACT_APP_PEER_SERVER}/${room.name}/state`, {
          roomState,
        })
        .then(({ data }) => {
          if (data.ok === true) {
            const layoutChildren = Object.keys(roomState?.layout);
            const mixChildren = Object.keys(roomState?.mix);

            const children = [layoutChildren, mixChildren]
              .flat(1)
              .filter((c, i, a) => {
                return i === a.indexOf(c) && c !== "PARENT";
              });

            if (Array.isArray(children) && children.length > 0) {
              setConfirmLoad(
                `Loaded mix & layout preset slots for room with children: ${children.join(
                  ", "
                )}`
              );
            } else {
              setConfirmLoad("Loaded mix & layout preset slots");
            }
          }
        });
    };

    reader.readAsText(e.target.files[0]);
  }

  if (!room || !room.name) {
    return <></>;
  }
  return (
    <>
      <SaveLoadRoomDiv>
        <label>
          Show
          <br />
          Presets
          <span>
            Use the save/load buttons to download presets you have set up to
            your computer, and apply it at a later time. You may load presets
            into a different room and it would still work provided the child
            node names are kept consistent.
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

      {confirmLoad && <Popper message={confirmLoad} />}
    </>
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
