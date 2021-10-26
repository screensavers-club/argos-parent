import { useParticipant, VideoRenderer } from "livekit-react";

export default function VideoParticipant({ participant }) {
  const { metadata, cameraPublication, screenSharePublication } =
    useParticipant(participant);

  if (cameraPublication) {
    return (
      <VideoRenderer
        track={cameraPublication.track}
        key={cameraPublication.track.sid}
      />
    );
  }

  // if (screenSharePublication) {
  //   return (
  //     <VideoRenderer
  //       track={screenSharePublication.track}
  //       key={screenSharePublication.track.sid}
  //     />
  //   );
  // }

  return <></>;
}
