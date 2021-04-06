import React, { useEffect, useRef } from 'react';
import { useChatContext } from 'contexts';

export default function Outgoing() {
  const myStreamRef = useRef(null);
  const mounted = useRef(true);
  const {
    state: { myStream },
    actions: { onSetMyStream }
  } = useChatContext();
  useEffect(() => {
    mounted.current = true;
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
      myStreamRef.current?.getTracks()?.[0]?.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    myStreamRef.current = myStream;
  }, [myStream]);

  return <></>;
}
