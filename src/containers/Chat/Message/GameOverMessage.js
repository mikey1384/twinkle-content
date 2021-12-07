import React, { memo } from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import { css } from '@emotion/css';
import { Color, mobileMaxWidth } from 'constants/css';
import localize from 'constants/localize';

const chessEndedInDrawLabel = localize('chessEndedInDraw');

GameOverMessage.propTypes = {
  opponentName: PropTypes.string,
  myId: PropTypes.number.isRequired,
  winnerId: PropTypes.number,
  isDraw: PropTypes.bool,
  isResign: PropTypes.bool
};

function GameOverMessage({ myId, opponentName, winnerId, isDraw, isResign }) {
  return (
    <ErrorBoundary>
      <div
        style={{
          marginRight: '1rem',
          paddingBottom: '1rem'
        }}
      >
        <div
          className={css`
            background: ${isDraw
              ? Color.logoBlue()
              : myId === winnerId
              ? Color.brownOrange()
              : Color.black()};
            font-size: 2.5rem;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: ${isDraw ? '2rem' : '1rem'};
            color: #fff;
            @media (max-width: ${mobileMaxWidth}) {
              font-size: 1.7rem;
            }
          `}
        >
          {isDraw ? (
            <div style={{ textAlign: 'center' }}>{chessEndedInDrawLabel}</div>
          ) : isResign ? (
            myId === winnerId ? (
              <div style={{ textAlign: 'center' }}>
                <p>{opponentName} resigned!</p>
                <p style={{ fontWeight: 'bold' }}>You win!</p>
              </div>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <p>You resigned...</p>
                <p>{opponentName} wins</p>
              </div>
            )
          ) : myId === winnerId ? (
            <div style={{ textAlign: 'center' }}>
              <p>{opponentName} failed to make a move in time...</p>
              <p style={{ fontWeight: 'bold' }}>You win!</p>
            </div>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <p>You failed to make a move in time...</p>
              <p>{opponentName} wins</p>
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default memo(GameOverMessage);
