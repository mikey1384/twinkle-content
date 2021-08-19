import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Color, mobileMaxWidth } from 'constants/css';
import { css } from '@emotion/css';

RewardLevelExpectation.propTypes = {
  rewardLevel: PropTypes.number.isRequired
};

export default function RewardLevelExpectation({ rewardLevel }) {
  if (rewardLevel < 3) {
    return null;
  }
  const rewardLevelExpectation = useMemo(() => {
    switch (rewardLevel) {
      case 2:
        return `Minimal Effort`;
      case 3:
        return 'Moderate Effort';
      case 4:
        return 'A Lot of Effort';
      case 5:
        return 'Huge Effort';
      default:
        return '';
    }
  }, [rewardLevel]);
  const rewardColor = useMemo(
    () =>
      rewardLevel === 5
        ? Color.gold()
        : rewardLevel === 4
        ? Color.cranberry()
        : Color.orange(),
    [rewardLevel]
  );
  const rewardLevelExplanation = useMemo(() => {
    if (rewardLevelExpectation === '') {
      return '';
    }
    return (
      <div
        className={css`
          font-size: 1.5rem;
          @media (max-width: ${mobileMaxWidth}) {
            font-size: 1.2rem;
          }
        `}
      >
        <span style={{ color: '#fff' }}>
          Put {rewardLevelExpectation} Into Your Response to Get Recommendations{' '}
        </span>
        <b style={{ color: rewardColor }}>(Lvl {rewardLevel})</b>
      </div>
    );
  }, [rewardLevel, rewardLevelExpectation, rewardColor]);
  if (!rewardLevelExpectation) return null;
  return (
    <div
      className={css`
        padding: 1rem;
        font-size: 1.5rem;
        font-weight: bold;
        background: ${rewardLevel === 5 ? Color.black() : Color.darkerGray()};
        margin-bottom: 1rem;
        margin-left: CALC(-1rem - 1px);
        margin-right: CALC(-1rem - 1px);
        @media (max-width: ${mobileMaxWidth}) {
          margin-left: -1rem;
          margin-right: -1rem;
        }
      `}
    >
      {rewardLevelExplanation}
    </div>
  );
}
