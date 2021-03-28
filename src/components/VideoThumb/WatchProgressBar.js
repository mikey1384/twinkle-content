import React from 'react';
import { Color } from 'constants/css';

export default function WatchProgressBar() {
  return (
    <div style={{ position: 'absolute', width: '100%', bottom: 0 }}>
      <div style={{ background: Color.red(), height: '5px', width: '100%' }} />
    </div>
  );
}
