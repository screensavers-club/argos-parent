import styled from "styled-components";
import VideoLayouts from "../../util/video-layouts";
import { Edit } from "react-ikonate";
import { useParticipant } from "livekit-react";
import VideoSlot from "./video-slot";

export default function ParticipantLayoutEditor({
  context,
  send,
  room,
  participants,
  activeLayout,
  setActiveLayout,
  setLayoutState,
  getLayoutState,
}) {
  const participant = participants.find(
    (p) => p.sid === context.editing_layout
  );

  const peers = participants.filter((p) => p.sid !== context.editing_layout);

  let nickname = false;

  if (participant && participant.metadata) {
    nickname = JSON.parse(participant.metadata)?.nickname;
  }

  if (!nickname) {
    return <></>;
  }

  return (
    <>
      <LayoutSelector
        className={`available-layouts${
          context.editing_layout ? "" : " disabled"
        }`}
      >
        <h4>Default layouts</h4>

        <div className="grid">
          {Object.keys(VideoLayouts).map((layoutKey) => (
            <button
              key={layoutKey}
              className={`${
                activeLayout && activeLayout.layout === layoutKey
                  ? "active"
                  : ""
              }`}
              onClick={() => {
                // retain selection
                let _slots = VideoLayouts[layoutKey].slots
                  ? [...VideoLayouts[layoutKey].slots]
                  : [];

                // mutation in place ...
                _slots.forEach((slot, i) => {
                  slot.participant = {
                    ...activeLayout?.slots?.[i]?.participant,
                  };
                });

                setLayoutState(room.name, nickname, {
                  ...VideoLayouts[layoutKey],
                  layout: layoutKey,
                  slots: _slots,
                }).then(({ data }) => {
                  setActiveLayout(data.layout);
                });
              }}
            >
              <img
                src={VideoLayouts[layoutKey].icon}
                alt={`Layout ${layoutKey}`}
              />
            </button>
          ))}
        </div>

        <h4>Custom layouts</h4>

        <div className="grid">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <button key={`layout_custom_${n}`}>
              <img
                src={`/images/layout-icons/layout-c${n}.svg`}
                alt={`Custom layout`}
              />
            </button>
          ))}
        </div>
      </LayoutSelector>

      <Editor className={`layout ${context.editing_layout ? "" : "disabled"}`}>
        <div className="canvas-wrapper">
          <div className="grid-lines">
            {new Array(11).fill(0).map((i, n) => (
              <>
                <div
                  className={`grid-v ${(n - 2) % 3 === 0 ? "quarter" : ""}`}
                  key={`grid-v-${n}`}
                  style={{ left: `${(n + 1) * 8.33}%` }}
                />
                <div
                  className={`grid-h ${(n - 2) % 3 === 0 ? "quarter" : ""}`}
                  key={`grid-h-${n}`}
                  style={{ top: `${(n + 1) * 8.33}%` }}
                />
              </>
            ))}
          </div>

          <div className="video-slots">
            {!activeLayout || activeLayout.layout === "Default" ? (
              <></>
            ) : (
              context.editing_layout &&
              activeLayout &&
              activeLayout.slots.map((slot, i) => {
                return (
                  <div
                    className="slot"
                    key={`${context.editing_layout}_slot_${i}_${
                      slot.participant?.nickname || "_"
                    }`}
                    style={{
                      left: `${slot.position[0]}%`,
                      top: `${slot.position[1]}%`,
                      width: `${slot.size[0]}%`,
                      height: `${slot.size[1]}%`,
                    }}
                  >
                    {(() => {
                      let candidateNickname;
                      if (slot.participant && slot.participant.nickname) {
                        candidateNickname = slot.participant.nickname;
                      } else {
                        candidateNickname = false;
                      }

                      return (
                        <VideoSlot
                          nickname={candidateNickname}
                          participant={participant}
                          participants={peers}
                          setSlot={(slotNickname) => {
                            let _layout = { ...activeLayout };
                            _layout.slots[i] = {
                              ...activeLayout.slots[i],
                              participant: { nickname: slotNickname },
                            };
                            setLayoutState(room.name, nickname, _layout).then(
                              ({ data }) => {
                                setActiveLayout(data.layout);
                              }
                            );
                          }}
                        />
                      );
                    })()}
                  </div>
                );
              })
            )}
          </div>
        </div>

        <button className="edit-custom-layout">
          <Edit />
        </button>
      </Editor>
    </>
  );
}

const LayoutSelector = styled.div.attrs((p) => ({ className: p.className }))`
  height: 100%;

  &.disabled {
    pointer-events: none;
    opacity: 0.6;
  }

  h4 {
    text-align: center;
    font-size: 0.75rem;
    font-weight: normal;
    line-height: 1;
    margin: 2em 0 0.5em 0;
    text-transform: uppercase;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    padding: 8px;
    gap: 8px;

    button {
      background: #222229;
      appearance: none;
      outline: none;
      display: flex;
      border: 1px solid #222229;
      justify-content: center;
      align-items: center;
      padding: 8px 0;
      border-radius: 8px;
      cursor: pointer;

      &:hover {
        background: #2e2e35;
        border: 1px solid #aaa;
      }

      &.active {
        background: #5736fd;
        border: 1px solid #fff;
      }

      img {
        display: block;
        width: 65%;
      }
    }
  }
`;

const Editor = styled.div.attrs((p) => ({ className: p.className }))`
  position: relative;
  border-left: 1px solid #111115;
  padding: 16px;

  &.disabled {
    pointer-events: none;
    opacity: 0.6;
  }

  .canvas-wrapper {
    aspect-ratio: 16/9;
    box-sizing: border-box;
    background: #111115;
    position: relative;

    .grid-lines {
      pointer-events: none;

      .grid-v {
        position: absolute;
        top: 0;
        height: 100%;
        width: 0;
        border-left: 1px solid #222;

        &.quarter {
          border-left: 1px solid #333;
        }
      }

      .grid-h {
        position: absolute;
        left: 0;
        width: 100%;
        height: 0;
        border-top: 1px solid #222;

        &.quarter {
          border-top: 1px solid #333;
        }
      }
    }

    .video-slots {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;

      .slot {
        position: absolute;
        background: linear-gradient(
          115deg,
          rgba(10, 10, 27, 1) 15%,
          rgba(42, 43, 47, 1) 100%
        );
        box-sizing: border-box;
      }
    }
  }

  button.edit-custom-layout {
    width: 2rem;
    height: 2rem;
    font-size: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: 1px solid #fff;
    border-radius: 100%;
    color: #fff;
    position: absolute;
    right: 36px;
    top: 36px;
    cursor: pointer;

    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  }
`;
