import { useParticipant } from "livekit-react";

export default function StreamControlCard({ participant }) {
  let p = useParticipant(participant);
  console.log(p);

  let meta;
  try {
    meta = JSON.parse(p.metadata);
  } catch (e) {}

  return <div>{meta?.nickname}</div>;
}
