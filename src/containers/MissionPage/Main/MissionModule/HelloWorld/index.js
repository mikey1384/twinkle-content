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

const initialCode = `function HomePage() {
  return (
    <div
      style={{
        color: "blue",
        border: "1px solid blue",
        fontSize: "2rem",
        padding: "1rem"
      }}
    >
      Change me
    </div>
  );
}`;

export default function HelloWorld({ task, onSetMissionState }) {
  const { deletedReplitCode, code } = task;

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
              newState: { deletedReplitCode: true }
            })
          }
          deletedCode={deletedReplitCode}
        />
        {deletedReplitCode && (
          <CodingHelloWorld
            code={code || initialCode}
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
