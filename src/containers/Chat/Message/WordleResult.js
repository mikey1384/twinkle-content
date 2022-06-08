import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import UsernameText from 'components/Texts/UsernameText';
import { css } from '@emotion/css';
import { Color, mobileMaxWidth } from 'constants/css';
import { addCommasToNumber } from 'helpers/stringHelpers';
import { SELECTED_LANGUAGE } from 'constants/defaultValues';

WordleResult.propTypes = {
  myId: PropTypes.number,
  userId: PropTypes.number,
  username: PropTypes.string,
  wordleResult: PropTypes.object.isRequired,
  timeStamp: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

const difficultyLabel = {
  1: 'basic',
  2: 'elementary',
  3: 'intermediate',
  4: 'advanced',
  5: 'epic'
};

export default function WordleResult({
  username,
  userId,
  myId,
  wordleResult,
  timeStamp
}) {
  const {
    isSolved,
    isStrict,
    numGuesses,
    solution,
    xpRewardAmount,
    wordLevel
  } = wordleResult;
  const difficultyColor = useMemo(() => {
    if (wordLevel === 5) return Color.gold();
    if (wordLevel === 4) return Color.red();
    if (wordLevel === 3) return Color.orange();
    if (wordLevel === 2) return Color.pink();
    return Color.logoBlue();
  }, [wordLevel]);
  const displayedUserLabel = useMemo(() => {
    if (userId === myId) {
      if (SELECTED_LANGUAGE === 'kr') {
        return '회원';
      }
      return 'You';
    }
    return (
      <UsernameText
        color="#fff"
        user={{
          id: userId,
          username
        }}
      />
    );
  }, [myId, userId, username]);
  const rewardAmountLabel = useMemo(
    () => addCommasToNumber(xpRewardAmount),
    [xpRewardAmount]
  );
  const guessLabel = useMemo(() => {
    if (numGuesses === 1) {
      return 'JACKPOT';
    }
    if (numGuesses === 2) {
      return 'UNBELIEVABLE';
    }
    if (numGuesses === 3) {
      return 'BRILLIANT';
    }
    if (numGuesses === 4) {
      return 'IMPRESSIVE';
    }
    return null;
  }, [numGuesses]);

  const bonusLabel = useMemo(() => {
    if (numGuesses < 3) {
      return null;
    }
    return isSolved && isStrict ? 'double reward bonus' : null;
  }, [isSolved, isStrict, numGuesses]);

  return (
    <div
      style={{
        width: '100%',
        background: Color.darkBlueGray(),
        color: '#fff',
        marginBottom: '1.5rem',
        position: 'relative'
      }}
    >
      <div
        style={{
          position: 'absolute',
          bottom: '5px',
          right: '8px'
        }}
        className={css`
          font-size: 1rem;
          @media (max-width: ${mobileMaxWidth}) {
            font-size: 0.8rem;
          }
        `}
      >
        {timeStamp}
      </div>
      <div
        className={css`
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: 100%;
          padding: 2rem 1rem;
          font-size: 1.6rem;
          @media (max-width: ${mobileMaxWidth}) {
            font-size: 1.3rem;
          }
        `}
      >
        {guessLabel && (
          <p
            style={{
              marginBottom: '0.5rem',
              color:
                numGuesses <= 2
                  ? Color.gold()
                  : numGuesses === 3
                  ? Color.brownOrange()
                  : Color.orange(),
              fontWeight: 'bold'
            }}
            className={css`
              font-size: ${numGuesses === 1
                ? '3rem'
                : numGuesses === 2
                ? '2.5rem'
                : numGuesses === 3
                ? '2.2rem'
                : '2rem'};
              @media (max-width: ${mobileMaxWidth}) {
                font-size: ${numGuesses === 1
                  ? '2.3rem'
                  : numGuesses === 2
                  ? '2rem'
                  : numGuesses === 3
                  ? '1.7rem'
                  : '1.5rem'};
              }
            `}
          >
            {guessLabel}
          </p>
        )}
        <div style={{ textAlign: 'center' }}>
          {displayedUserLabel} earned{' '}
          <span
            className={css`
              font-size: ${numGuesses <= 2 ? '2rem' : ''};
              @media (max-width: ${mobileMaxWidth}) {
                font-size: ${numGuesses <= 2 ? '1.5rem' : ''};
              }
            `}
            style={{
              fontWeight: isSolved ? 'bold' : ''
            }}
          >
            {rewardAmountLabel} XP
          </span>{' '}
          for {isSolved ? 'solving' : 'trying to solve'} a Wordle{' '}
          {isSolved ? (
            <>
              in{' '}
              <span
                style={{ fontWeight: numGuesses <= 4 ? 'bold' : 'default' }}
              >
                {numGuesses} guess
                {numGuesses === 1
                  ? '!!!'
                  : numGuesses === 2
                  ? 'es!!'
                  : numGuesses === 3
                  ? 'es!'
                  : 'es'}
              </span>
            </>
          ) : (
            ''
          )}
        </div>
        <p style={{ marginTop: '0.5rem' }}>
          The word was <b>{solution}</b> (
          <b style={{ color: difficultyColor }}>{difficultyLabel[wordLevel]}</b>{' '}
          word)
        </p>
        <p
          style={{
            marginTop: '0.5rem',
            fontWeight: 'bold',
            color: Color.brownOrange()
          }}
        >
          {bonusLabel}
        </p>
      </div>
    </div>
  );
}
