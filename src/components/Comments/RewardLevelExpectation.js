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
        return `Minimal Efforts`;
      case 3:
        return 'Moderate Efforts';
      case 4:
        return 'Significant Efforts';
      case 5:
        return 'Maximum Efforts';
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
      <>
        <span style={{ color: '#fff' }}>
          Put In {rewardLevelExpectation} to Earn Recommendations{' '}
        </span>
        <b style={{ color: rewardColor }}>(Lvl {rewardLevel})</b>
      </>
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
