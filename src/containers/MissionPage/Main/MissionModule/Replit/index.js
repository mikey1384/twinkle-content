import React from 'react';
import ErrorBoundary from 'components/ErrorBoundary';

export default function Replit() {
  const Space = () => <>&nbsp;&nbsp;</>;
  return (
    <ErrorBoundary style={{ width: '100%' }}>
      <code>
        <div>{`import { useEffect, useState } from 'react';`}</div>
        <br />
        <div>{`function HomePage() {`}</div>
        <div>
          <Space />
          {`const [code, setCode] = useState('code!');`}
        </div>
        <div>
          <Space />
          {`useEffect(() => {`}
        </div>
        <div>
          <Space />
          <Space />
          {`const name = 'mikey';`}
        </div>
        <div>
          <Space />
          <Space />
          {`let result = '';`}
        </div>
        <div>
          <Space />
          <Space />
          {`for (let i = 0; i < name.length; i++) {`}
        </div>
        <div>
          <Space />
          <Space />
          <Space />
          {`const number = name.charCodeAt(i) % 10;`}
        </div>
        <div>
          <Space />
          <Space />
          <Space />
          {`result += number;`}
        </div>
        <div>
          <Space />
          <Space />
          {`}`}
        </div>
        <div>
          <Space />
          <Space />
          {`setCode(result);`}
        </div>
        <div>
          <Space />
          {`}, []);`}
        </div>
        <br />
        <div>
          <Space />
          {`return (`}
        </div>
        <div>
          <Space />
          <Space />
          {`<div style={{width: '100%'}}>`}
        </div>
        <div>
          <Space />
          <Space />
          <Space />
          {`<div`}
        </div>
        <div>
          <Space />
          <Space />
          <Space />
          <Space />
          {`style={{`}
        </div>
        <div>
          <Space />
          <Space />
          <Space />
          <Space />
          <Space />
          {`height: 'CALC(100vh - 1rem)',`}
        </div>
        <div>
          <Space />
          <Space />
          <Space />
          <Space />
          <Space />
          {`display: 'flex',`}
        </div>
        <div>
          <Space />
          <Space />
          <Space />
          <Space />
          <Space />
          {`alignItems: 'center',`}
        </div>
        <div>
          <Space />
          <Space />
          <Space />
          <Space />
          <Space />
          {`justifyContent: 'center',`}
        </div>
        <div>
          <Space />
          <Space />
          <Space />
          <Space />
          <Space />
          {`fontSize: '2rem'`}
        </div>
        <div>
          <Space />
          <Space />
          <Space />
          <Space />
          {`}}`}
        </div>
        <div>
          <Space />
          <Space />
          <Space />
          {`>`}
        </div>
        <div>
          <Space />
          <Space />
          <Space />
          <Space />
          {`{code}`}
        </div>
        <div>
          <Space />
          <Space />
          <Space />
          {`</div>`}
        </div>
        <div>
          <Space />
          <Space />
          {`</div>`}
        </div>
        <div>
          <Space />
          {`)`}
        </div>
        <div>{`}`}</div>
        <br />
        <div>{`export default HomePage;`}</div>
      </code>
    </ErrorBoundary>
  );
}
