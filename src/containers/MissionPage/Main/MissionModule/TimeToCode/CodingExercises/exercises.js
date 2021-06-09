const exercies = [
  {
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
  }`
  },
  {
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
  }`
  },
  {
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
  }`
  }
];

export default exercies;
