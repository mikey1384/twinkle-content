import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
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
  const { isSolved, solution, xpRewardAmount, wordLevel } = wordleResult;
  const displayedUserLabel = useMemo(() => {
    if (userId === myId) {
      if (SELECTED_LANGUAGE === 'kr') {
        return '회원';
      }
      return 'You';
    }
    return username;
  }, [myId, userId, username]);
  const rewardAmountLabel = useMemo(
    () => addCommasToNumber(xpRewardAmount),
    [xpRewardAmount]
  );

  return (
    <div
      className={css`
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        padding: 2rem 0;
        margin: 2rem 0;
        background: ${Color.lightBlueGray()};
        color: #fff;
      `}
    >
      {isSolved && (
        <p>
          Wordle solved: {solution} ({difficultyLabel[wordLevel]} word)
        </p>
      )}
      <p style={{ marginTop: '0.5rem' }}>
        {displayedUserLabel} {isSolved ? 'solved' : 'attempted'} {`today's`}{' '}
        Wordle puzzle
        {isSolved ? ` and earned ${rewardAmountLabel} XP!` : ''}
      </p>
    </div>
  );
}
