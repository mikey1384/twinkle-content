import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import { css } from '@emotion/css';
import { Color, mobileMaxWidth } from 'constants/css';
import { useMyState, useWordleLabels } from 'helpers/hooks';
import { unix } from 'moment';

WordleResult.propTypes = {
  username: PropTypes.string.isRequired,
  userId: PropTypes.number.isRequired,
  timeStamp: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  wordleResult: PropTypes.object.isRequired
};

export default function WordleResult({
  userId,
  username,
  timeStamp,
  wordleResult
}) {
  const { userId: myId } = useMyState();
  const { resultLabel, solutionLabel } = useWordleLabels({
    ...wordleResult,
    username,
    userId,
    myId
  });
  const displayedTimeStamp = useMemo(
    () => unix(timeStamp).format('lll'),
    [timeStamp]
  );

  return (
    <ErrorBoundary
      componentPath="Message/TargetMessage/WordleResult"
      style={{ width: '100%', height: '100%' }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          background: Color.darkBlueGray(),
          color: '#fff',
          marginBottom: '1.5rem',
          position: 'relative'
        }}
      >
        <div
          className={css`
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 100%;
            padding: 2rem 1rem;
            @media (max-width: ${mobileMaxWidth}) {
              font-size: 1.1rem;
            }
          `}
        >
          <div style={{ textAlign: 'center' }}>{resultLabel}</div>
          <p style={{ marginTop: '0.5rem' }}>{solutionLabel}</p>
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: '5px',
            right: '8px'
          }}
          className={css`
            font-size: 0.8rem;
            @media (max-width: ${mobileMaxWidth}) {
              font-size: 0.6rem;
            }
          `}
        >
          {displayedTimeStamp}
        </div>
      </div>
    </ErrorBoundary>
  );
}
