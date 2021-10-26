import { useParticipant, VideoRenderer } from "livekit-react";

export default function VideoParticipant({ participant }) {
  const { metadata, cameraPublication, publications } =
    useParticipant(participant);

  if (cameraPublication && cameraPublication.track) {
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
