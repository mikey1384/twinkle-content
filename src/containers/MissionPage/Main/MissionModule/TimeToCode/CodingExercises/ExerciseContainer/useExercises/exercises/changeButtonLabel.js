import React from 'react';
import { Color } from 'constants/css';
import { BUTTON_LABEL } from '../constants';

export const title = `2. Tap Me`;
export const instruction = (
  <>
    Change the label of the button from {`"Change me"`} to {`"${BUTTON_LABEL}"`}{' '}
    and tap the <b style={{ color: Color.green() }}>check</b> button
  </>
);
export const initialCode = `function HomePage() {
  return (
    <div
      style={{
        width: '100%',
        height: "100%",
        display: 'flex',
        justifyContent: 'center'
      }}
    >
      <button
        style={{
          color: "white",
          background: "blue",
          border: "none",
          fontSize: "2rem",
          padding: "1rem",
          cursor: "pointer"
        }}
        onClick={() => alert('I am a button')}
      >
        Change me
      </button>
    </div>
  );
}`;
