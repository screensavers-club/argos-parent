import AudioControls from "../components/audio-controls";

export default function PlayGround() {
  const [selectTab, setSelectTab] = useState("stream");

  return <AudioControls selectTab={selectTab} setSelectTab={setSelectTab} />;
}
