import React from 'react';

export const title = `Formatting`;
export const instruction = <>Try pressing the format button</>;
export const initialCode = `function HomePage() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}
    >
      <p
        style={{
          color: "#4B9BE1",
          fontFamily: "sans-serif",
          fontWeight: "bold",
          fontSize: "2rem"
        }}
      >
Welcome to My Website!
      </p>
      <button
        style={{
          marginTop: "0rem",
          padding: "1rem",
          color: "white",
          background: "blue",
          border: "none",
          fontSize: "2rem",
          cursor: "pointer"
        }}
        onClick={() => alert("Hello World")}
      >
        Tap me
      </button>
    </div>
  );
}`;

const formattedCode = `function HomePage() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}
    >
      <p
        style={{
          color: "#4B9BE1",
          fontFamily: "sans-serif",
          fontWeight: "bold",
          fontSize: "2rem"
        }}
      >
        Welcome to My Website!
      </p>
      <button
        style={{
          marginTop: "0rem",
          padding: "1rem",
          color: "white",
          background: "blue",
          border: "none",
          fontSize: "2rem",
          cursor: "pointer"
        }}
        onClick={() => alert("Hello World")}
      >
        Tap me
      </button>
    </div>
  );
}`;

export async function onRunCode({
  code,
  onSetErrorMsg,
  onUpdateMissionStatus
}) {
  if (code === formattedCode) {
    return await onUpdateMissionStatus();
  }
  onSetErrorMsg(`Something's not right - please check the code`);
}
