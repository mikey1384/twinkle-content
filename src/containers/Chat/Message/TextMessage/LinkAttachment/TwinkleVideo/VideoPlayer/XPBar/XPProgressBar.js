import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import ProgressBar from 'components/ProgressBar';
import Icon from 'components/Icon';
import { useMyState } from 'helpers/hooks';
import { returnXpLevelColor, videoRewardHash } from 'constants/defaultValues';
import { Color, mobileMaxWidth } from 'constants/css';
import { css } from '@emotion/css';
import { addCommasToNumber } from 'helpers/stringHelpers';
import localize from 'constants/localize';

const continueLabel = localize('continue');
const watchingLabel = localize('watching');
const perMinuteLabel = localize('perMinute');

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
  const { rewardBoostLvl } = useMyState();
  const watching = startingPosition > 0;
  const continuingStatusShown = useMemo(
    () => watching && !started,
    [started, watching]
  );
  const xpRewardAmount = useMemo(
    () => rewardLevel * (videoRewardHash?.[rewardBoostLvl]?.xp || 20),
    [rewardBoostLvl, rewardLevel]
  );
  const coinRewardAmount = useMemo(
    () => videoRewardHash?.[rewardBoostLvl]?.coin || 2,
    [rewardBoostLvl]
  );
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
      <div style={{ width: '100%', height: '2.7rem' }}>
        <div
          className={css`
            display: flex;
            flex-direction: column;
            align-items: center;
            height: 2.7rem;
            font-size: 1.3rem;
            @media (max-width: ${mobileMaxWidth}) {
              font-size: 1rem;
              height: '2rem';
            }
          `}
          style={{
            background: continuingStatusShown
              ? Color.darkBlue()
              : Color[xpLevelColor](),
            color: '#fff',
            fontWeight: 'bold',
            display: 'flex',
            flexGrow: 1,
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div style={{ marginLeft: '0.7rem' }}>
            {continuingStatusShown && (
              <span>
                {continueLabel}
                {` ${watchingLabel}`} (
              </span>
            )}
            <span>{addCommasToNumber(xpRewardAmount)} XP</span>
            {rewardLevel > 2 ? (
              <>
                {' '}
                <span>&</span>
                <Icon
                  style={{ marginLeft: '0.5rem' }}
                  icon={['far', 'badge-dollar']}
                />
                <span style={{ marginLeft: '0.2rem' }}>{coinRewardAmount}</span>
              </>
            ) : (
              ''
            )}
            {continuingStatusShown ? (
              <span>{`)`}</span>
            ) : (
              <span> {perMinuteLabel}</span>
            )}
          </div>
        </div>
      </div>
    );
  }
}
