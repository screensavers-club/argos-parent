import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import Button from "../components/button";
import { useRoom } from "livekit-react";
import StreamTabs from "../components/stream-tabs";
import MixerPage from "../components/mixer-page";
import TogglePerformers from "../components/toggle-performers";

const StyledPage = styled.div`
	position: relative;
	display: block;

	div.roomCreated {
		text-align: center;
		font-size: 1.5rem;
		margin-top: 10%;
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

	div.controlPanel {
		display: block;
		margin: auto;
		padding: auto;
	}
`;

export default function StreamRoom({ context, send, parents }) {
	const { room, connect, participants, audioTracks } = useRoom();
	const [selectTab, setSelectTab] = useState("stream");
	const [renderState, setRenderState] = useState(0);

	const audioCtx = useRef(new AudioContext());
	const audioTrackRefs = useRef({});
	const [audioTrackRefsState, setAudioTrackRefsState] = useState(
		audioTrackRefs.current
	);

	const videoTrackRefs = useRef({});
	const [videoTrackRefsState, setVideoTrackRefsState] = useState(
		videoTrackRefs.current
	);

	useEffect(() => {
		let __tracks = [];
		audioTracks.forEach((audioTrack) => {
			if (__tracks.indexOf(audioTrack.sid) < 0 && audioTrack.mediaStreamTrack) {
				__tracks.push(audioTrack.sid);
				let mst = audioCtx.current.createMediaStreamTrackSource(
					audioTrack.mediaStreamTrack
				);
				let gainNode = new GainNode(audioCtx.current, { gain: 1 });
				audioTrackRefs.current[audioTrack.sid] = {
					mediaStreamTrackSource: mst,
					gainNode: gainNode,
				};
				mst.connect(gainNode).connect(audioCtx.current.destination);
			}
		});

		Object.keys(audioTrackRefs.current).forEach((key) => {
			if (__tracks.indexOf(key) < 0) {
				audioTrackRefs.current[key].mediaStreamTrackSource.disconnect();
				audioTrackRefs.current[key].gainNode.disconnect();
				delete audioTrackRefs.current[key];
			}
		});
		setAudioTrackRefsState(audioTrackRefs.current);
		setRenderState(renderState + 1);
	}, [audioTracks]);

	useEffect(() => {
		let __tracks = [];
		participants.forEach((participant) => {
			if (participant.videoTracks.size < 1) {
				return;
			}

			let firstVideo = null;

			participant.videoTracks.forEach((track, key) => {
				if (!firstVideo) {
					firstVideo = { track, key };
				} else {
					return;
				}
			});

			if (__tracks.indexOf(firstVideo.key) < 0) {
				__tracks.push(firstVideo.key);
				videoTrackRefs.current[firstVideo.key] = {
					videoTrack: firstVideo.track,
				};
			}
		});

		Object.keys(videoTrackRefs.current).forEach((key) => {
			if (__tracks.indexOf(key) < 0) {
				delete videoTrackRefs.current[key];
			}
		});
		setVideoTrackRefsState(videoTrackRefs.current);
		setRenderState(renderState + 1);
	}, [participants]);

	const [control, setControl] = useState(context.input);
	let [activeControl, setActiveControl] = useState(0);

	useEffect(() => {
		connect(`${process.env.REACT_APP_LIVEKIT_SERVER}`, context.token)
			.then((room) => {
				console.log("room connected");
			})
			.catch((err) => console.log({ err }));
		return () => {
			room?.disconnect();
		};
	}, []);

	return (
		<StyledPage>
			<div className="button">
				<Button
					onClick={() => {
						room?.disconnect();
						send("RESET");
					}}
					variant="small"
				>
					Disconnect
				</Button>
			</div>

			<StreamTabs setSelectTab={setSelectTab} />

			{(function () {
				switch (selectTab) {
					case "stream":
						return (
							<>
								<MainControlView>
									<div className="participants">
										{participants
											.filter((p) => p.metadata === "CHILD")
											.map((participant) => {
												let firstAudioTrack = null;
												participant.audioTracks.forEach((value, key) => {
													if (!firstAudioTrack) {
														firstAudioTrack = value;
													}
												});
												let trackRef =
													audioTrackRefsState[firstAudioTrack?.trackSid];

												return (
													<div
														style={{ borderBottom: "1px solid #aaa" }}
														key={participant.identity}
													>
														<span className="user">{participant.identity}</span>
														{trackRef && (
															<button
																onClick={() => {
																	if (trackRef && trackRef?.gainNode) {
																		let targetGain =
																			trackRef.gainNode.gain.value === 0
																				? 1
																				: 0;
																		trackRef.gainNode.gain.setValueAtTime(
																			targetGain,
																			audioCtx.current.currentTime
																		);
																	}

																	setRenderState(renderState + 1);
																}}
															>
																{trackRef?.gainNode?.gain?.value
																	? "Mute"
																	: "Unmute"}
															</button>
														)}
													</div>
												);
											})}
									</div>
									<div className="videos">
										{Object.keys(videoTrackRefsState).map((key, i) => {
											if (!videoTrackRefsState[key]?.videoTrack?.track) {
												return <></>;
											}
											return (
												<VideoFrame
													track={videoTrackRefsState[key]}
													key={key}
												/>
											);
										})}
									</div>
									<div>Controls</div>
								</MainControlView>
							</>
						);

					case "layout":
						return (
							<VideoLayoutEditor
								participants={participants}
								videoTrackRefsState={videoTrackRefsState}
								onChange={() => {}}
							/>
						);

					case "mixer":
						return (
							<MixerPage
								control={control}
								setControl={setControl}
								master={context.master}
							/>
						);
					case "monitor":
						return <>This is the monitor page</>;

					case "out":
						return <>This is the out page</>;

					default:
						<></>;
				}
			})()}
		</StyledPage>
	);
}

function VideoFrame({ track }) {
	const ref = useRef(null);

	useEffect(() => {
		const el = ref.current;
		if (!el) {
			return;
		}
		el.muted = true;
		track?.videoTrack?.track?.attach(el);
		el.play();

		return () => {
			track?.videoTrack?.track?.detach(el);
		};
	}, []);
	return (
		<div>
			<video ref={ref} muted autoPlay />
		</div>
	);
}

const MainControlView = styled.div`
	width: 100%;
	height: 100vh;
	display: grid;
	grid-template-columns: 15% 70% 15%;

	.participants {
		padding: 10px;
		> div {
			display: flex;
			align-items: center;

			span.user {
				text-overflow: ellipsis;
				white-space: nowrap;
				overflow: hidden;
				font-size: 12px;
				width: 80%;
				margin: 3px 0;
			}
		}
	}

	.videos {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		grid-template-rows: repeat(4, 1fr);
		width: 100%;
		height: 100%;
		min-height: 80vh;

		> div {
			width: 100%;
			height: 100%;
			object-fit: cover;
			overflow: hidden;

			video {
				width: 100%;
				height: 100%;
				object-fit: cover;
			}
		}
	}
`;

function VideoLayoutEditor({ onChange, participants, videoTrackRefsState }) {
	const [editing, setEditing] = useState(null);
	return (
		<VideoLayoutEditorDiv>
			<div className="participantList">
				{participants
					.filter((p) => p.metadata === "CHILD")
					.map((participant, i) => {
						let videoTrack;
						participant.videoTracks?.forEach((value, key) => {
							if (videoTrack) {
								return;
							}
							videoTrack = key;
						});
						return (
							<div
								onClick={() => {
									setEditing(participant.identity);
								}}
								className={`participant${
									editing === participant.identity ? " active" : ""
								}`}
								key={videoTrack || "participant" + i}
							>
								<div className="thumbnail">
									{videoTrack ? (
										<VideoFrame track={videoTrackRefsState[videoTrack]} />
									) : (
										<></>
									)}
								</div>
							</div>
						);
					})}
			</div>

			<div className="canvas">
				<b className="h" />
				<b className="h" />
				<b className="h" />
				<b className="h" />
				<b className="v" />
				<b className="v" />
				<b className="v" />
				<b className="v" />
				<div className="video_container"></div>
			</div>

			<div className={`layout ${!editing ? " locked" : ""}`}>
				<label>Modes</label>
				<br />
				<button>
					<img src="/images/layout-icons/a.svg" alt="Layout A" />
				</button>
				<button>
					<img src="/images/layout-icons/b.svg" alt="Layout B" />
				</button>
				<button>
					<img src="/images/layout-icons/c.svg" alt="Layout C" />
				</button>
				<button>
					<img src="/images/layout-icons/d.svg" alt="Layout D" />
				</button>
				<button>
					<img src="/images/layout-icons/e.svg" alt="Layout E" />
				</button>
				<button>
					<img src="/images/layout-icons/f.svg" alt="Layout F" />
				</button>
			</div>
		</VideoLayoutEditorDiv>
	);
}

const VideoLayoutEditorDiv = styled.div`
	display: grid;
	width: 100%;
	grid-template-columns: 15% 70% 15%;

	div.participantList {
		.participant {
			display: flex;
			border-bottom: 1px solid #aaa;
			cursor: pointer;
			padding: 5px;

			&.active {
				background: #ff9;
			}

			.thumbnail {
				width: 150px;

				> div {
					width: 100%;
					height: 0;
					box-sizing: border-box;
					padding-top: 55%;
					position: relative;

					video {
						width: 100%;
						height: 100%;
						position: absolute;
						object-fit: contain;
						top: 0;
						background: #000;
					}
				}
			}
		}
	}

	div.canvas {
		position: relative;
		border: 1px solid #ddd;
		height: 0;
		box-sizing: border-box;
		padding-top: 56%;

		b.h {
			position: absolute;
			display: block;
			height: 0;
			width: 100%;
			left: 0;
			border-bottom: 1px solid #ddd;

			&:nth-of-type(1) {
				top: 20%;
			}

			&:nth-of-type(2) {
				top: 40%;
			}

			&:nth-of-type(3) {
				top: 60%;
			}

			&:nth-of-type(4) {
				top: 80%;
			}
		}

		b.v {
			position: absolute;
			display: block;
			height: 100%;
			width: 0;
			border-left: 1px solid #ddd;
			top: 0;

			&:nth-of-type(5) {
				left: 20%;
			}

			&:nth-of-type(6) {
				left: 40%;
			}

			&:nth-of-type(7) {
				left: 60%;
			}

			&:nth-of-type(8) {
				left: 80%;
			}
		}
	}

	.layout {
		&.locked {
			opacity: 0.3;
			pointer-events: none;
		}

		label {
			display: block;
		}
		button {
			cursor: pointer;
			display: block;
			padding: 10px;
			border: 1px solid #000;
			background: #fff;
			margin: 0 0 5px 0;
			img {
				width: 40px;
			}
		}
	}
`;
