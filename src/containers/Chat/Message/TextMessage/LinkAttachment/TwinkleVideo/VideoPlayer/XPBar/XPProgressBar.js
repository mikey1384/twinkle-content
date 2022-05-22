import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import ProgressBar from 'components/ProgressBar';
import { returnXpLevelColor } from 'constants/defaultValues';
import { Color, mobileMaxWidth } from 'constants/css';
import { css } from '@emotion/css';
import RewardAmountInfo from '../../RewardAmountInfo';

XPProgressBar.propTypes = {
  rewardLevel: PropTypes.number,
  started: PropTypes.bool,
  startingPosition: PropTypes.number,
  userId: PropTypes.number,
  videoProgress: PropTypes.number
};

export default function XPProgressBar({
  rewardLevel,
  started,
  startingPosition,
  userId,
  videoProgress
}) {
  const xpLevelColor = useMemo(
    () => returnXpLevelColor(rewardLevel),
    [rewardLevel]
  );

  if (!userId || !rewardLevel) {
    return null;
  }
  if (started) {
    return (
      <ProgressBar
        className={css`
          margin-top: 0;
          flex-grow: 1;
          height: 2.7rem !important;
          margin-top: 0 !important;
          @media (max-width: ${mobileMaxWidth}) {
            font-size: 1rem;
            height: 2rem !important;
            font-size: 0.8rem !important;
          }
        `}
        progress={videoProgress}
        color={Color[xpLevelColor]()}
        noBorderRadius
      />
    );
  } else {
    return (
      <RewardAmountInfo
        rewardLevel={rewardLevel}
        startingPosition={startingPosition}
      />
    );
  }
}
