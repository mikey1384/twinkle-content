import React from 'react';
import { Color } from 'constants/css';

export const title = `1. Make It Blue`;
export const instruction = (
  <>
    Change the color of the <b style={{ color: 'red' }}>red</b> button below to{' '}
    <b style={{ color: 'blue' }}>blue</b> and tap the{' '}
    <b style={{ color: Color.green() }}>check</b> button
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
          background: "red",
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
