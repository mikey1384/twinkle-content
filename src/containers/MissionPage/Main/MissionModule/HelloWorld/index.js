import React from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import { css } from '@emotion/css';
import DeleteCode from './DeleteCode';
import CodingHelloWorld from './CodingHelloWorld';

HelloWorld.propTypes = {
  task: PropTypes.object.isRequired,
  onSetMissionState: PropTypes.func.isRequired
};

export default function HelloWorld({ task, onSetMissionState }) {
  const {
    deletedCode,
    code = `function HomePage() {
  return <div>Welcome to Next.js!</div>;
}

export default HomePage;`
  } = task;

  return (
    <ErrorBoundary>
      <div
        className={css`
          width: 100%;
          font-size: 1.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          p {
            font-size: 2rem;
            font-weight: bold;
          }
        `}
      >
        <DeleteCode
          onSetDeletedCode={() =>
            onSetMissionState({
              missionId: task.id,
              newState: { deletedCode: true }
            })
          }
          deletedCode={deletedCode}
        />
        {deletedCode && (
          <CodingHelloWorld
            code={code}
            onSetCode={(code) =>
              onSetMissionState({
                missionId: task.id,
                newState: { code }
              })
            }
            style={{
              marginTop: '5rem'
            }}
          />
        )}
      </div>
    </ErrorBoundary>
  );
}
