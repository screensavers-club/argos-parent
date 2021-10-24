import StreamControlCard from "./stream-control-card";

export default function StreamEditor({ room, participants }) {
  return (
    <>
      {participants.map((p) => (
        <StreamControlCard participant={p} key={p.id} />
      ))}
    </>
  );
}
