import { ALERT_MSG } from '../constants';

export const title = `3. Hello World`;
export const instruction = `Make it so that when you tap the "Tap me" button you get an alert
message that says "${ALERT_MSG}"`;
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
        Tap me
      </button>
    </div>
  );
}`;
