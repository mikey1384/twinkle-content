import React from 'react';
import { Color } from 'constants/css';

const BUTTON_LABEL = 'Tap me';
const ALERT_MSG = 'Hello World';

export default function useExercises() {
  return [
    {
      title: '1. Make It Blue',
      initialCode: `function HomePage() {
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
    }`,
      instruction: (
        <>
          Change the color of the <b style={{ color: 'red' }}>red</b> button
          below to <b style={{ color: 'blue' }}>blue</b> and tap the{' '}
          <b style={{ color: Color.green() }}>check</b> button
        </>
      )
    },
    {
      BUTTON_LABEL,
      title: '2. Tap Me',
      initialCode: `function HomePage() {
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
    }`,
      instruction: (
        <>
          Change the label of the button from {`"Change me"`} to{' '}
          {`"${BUTTON_LABEL}"`} and tap the{' '}
          <b style={{ color: Color.green() }}>check</b> button
        </>
      )
    },
    {
      ALERT_MSG,
      title: '3. Hello World',
      initialCode: `function HomePage() {
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
            Tap me
          </button>
        </div>
      );
    }`,
      instruction: `Make it so that when you tap the "Tap me" button you get an alert
    message that says "${ALERT_MSG}"`
    }
  ];
}
