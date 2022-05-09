import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import UsernameText from 'components/Texts/UsernameText';
import { css } from '@emotion/css';
import { Color } from 'constants/css';
import { addCommasToNumber } from 'helpers/stringHelpers';
import { SELECTED_LANGUAGE } from 'constants/defaultValues';

WordleResult.propTypes = {
  myId: PropTypes.number,
  userId: PropTypes.number,
  username: PropTypes.string,
  wordleResult: PropTypes.object.isRequired
};

const difficultyLabel = {
  1: 'basic',
  2: 'elementary',
  3: 'intermediate',
  4: 'advanced',
  5: 'epic'
};

export default function WordleResult({ username, userId, myId, wordleResult }) {
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
      return 'INCREDIBLE';
    }
    return isStrict ? 'double reward unlocked!' : '';
  }, [isStrict, numGuesses]);

  return (
    <div
      className={css`
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        padding: 2rem 0;
        margin-bottom: 1.5rem;
        background: ${Color.darkBlueGray()};
        color: #fff;
      `}
    >
      <p>
        Wordle{' '}
        {isSolved ? (
          <span style={{ fontWeight: 'bold' }}>solved</span>
        ) : (
          'failed'
        )}{' '}
        - <b>{solution}</b> (
        <b style={{ color: difficultyColor }}>{difficultyLabel[wordLevel]}</b>{' '}
        word)
      </p>
      {isSolved && (
        <p style={{ marginTop: '0.5rem' }}>
          Number of guesses: {numGuesses}
          {numGuesses === 1 ? ' (wait, what???)' : ''}
        </p>
      )}
      {guessLabel && (
        <p
          style={{
            marginTop: '0.5rem',
            color:
              numGuesses <= 2
                ? Color.gold()
                : isSolved && isStrict
                ? Color.orange()
                : '#fff',
            fontWeight:
              numGuesses <= 2 || (isSolved && isStrict) ? 'bold' : 'default',
            fontSize:
              numGuesses === 1 ? '3rem' : numGuesses === 2 ? '2.5rem' : '1.7rem'
          }}
        >
          {guessLabel}
        </p>
      )}
      <p style={{ marginTop: '0.5rem' }}>
        {displayedUserLabel} earned{' '}
        <span
          style={{
            fontSize: numGuesses <= 2 ? '2rem' : '',
            fontWeight: isSolved ? 'bold' : ''
          }}
        >
          {rewardAmountLabel} XP
        </span>{' '}
        for {isSolved ? 'solving' : 'trying'} {`today's`} Wordle
      </p>
    </div>
  );
}
