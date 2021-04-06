import React, { useEffect, useRef } from 'react';
import { useChatContext } from 'contexts';

export default function Outgoing() {
  const audioRef = useRef(null);
  const mounted = useRef(true);
  const {
    actions: { onSetMyStream }
  } = useChatContext();
  useEffect(() => {
    mounted.current = true;
    const currentAudio = audioRef.current;
    init();
    async function init() {
      const options = { audio: true };
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia(options);
        if (mounted.current) {
          onSetMyStream(stream);
        }
      }
    }

    return function cleanUp() {
      mounted.current = false;
      onSetMyStream(null);
      currentAudio.srcObject?.getTracks()?.forEach((track) => {
        track.stop();
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <audio
      autoPlay
      style={{ display: 'none', height: 0, width: 0 }}
      ref={audioRef}
    />
  );
}
