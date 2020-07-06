import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

Video.propTypes = {
  myVideoRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object])
};

export default function Video({ myVideoRef }) {
  useEffect(() => {
    const video = myVideoRef.current;
    return function cleanUp() {
      video.srcObject.getTracks()?.forEach((track) => {
        track.stop();
      });
    };
  }, [myVideoRef]);

  return (
    <video
      style={{
        width: '100%',
        maxHeight: '20rem'
      }}
      autoPlay
      playsInline
      ref={myVideoRef}
    />
  );
}
