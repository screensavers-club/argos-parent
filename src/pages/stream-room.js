import { useState, useEffect } from "react";
import styled from "styled-components";
import Button from "../components/button";
import { useRoom } from "livekit-react";
import StreamTabs from "../components/stream-tabs";
import StreamPage from "../components/stream-page";
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
	const { room, connect, participants } = useRoom();
	const [selectTab, setSelectTab] = useState("stream");

	console.log(participants);

	const [control, setControl] = useState(context.input);
	let [activeControl, setActiveControl] = useState(0);

	useEffect(() => {
		connect(`${process.env.REACT_APP_LIVEKIT_SERVER}`, context.token)
			.then((room) => {
				console.log(room);
			})
			.catch((err) => console.log({ err }));
	}, []);
	{
		console.log(room);
	}

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

			<StreamTabs setSelectTab={setSelectTab} />

			{(function () {
				switch (selectTab) {
					case "stream":
						return (
							<StreamPage
								parents={parents}
								performers={participants.map((p) => ({
									name: p.identity,
								}))}
								setSelectTab={setSelectTab}
								activeControl={activeControl}
								setActiveControl={setActiveControl}
								control={control}
								setControl={setControl}
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
				}
			})()}
			<TogglePerformers
				control={control}
				activeControl={activeControl}
				setActiveControl={setActiveControl}
			/>
		</StyledPage>
	);
}
