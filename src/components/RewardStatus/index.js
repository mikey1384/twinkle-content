import React, { memo, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/css';
import { Color, mobileMaxWidth } from 'constants/css';
import { addCommasToNumber, stringIsEmpty } from 'helpers/stringHelpers';
import { returnMaxRewards } from 'constants/defaultValues';
import LoadMoreButton from 'components/Buttons/LoadMoreButton';
import Comment from './Comment';
import ErrorBoundary from 'components/ErrorBoundary';
import Starmarks from './Starmarks';
import { useMyState } from 'helpers/hooks';

RewardStatus.propTypes = {
  className: PropTypes.string,
  rewardLevel: PropTypes.number,
  noMarginForEditButton: PropTypes.bool,
  onCommentEdit: PropTypes.func,
  rewards: PropTypes.array,
  style: PropTypes.object
};

function RewardStatus({
  className,
  rewardLevel,
  noMarginForEditButton,
  onCommentEdit,
  rewards = [],
  style
}) {
  const { userId } = useMyState();
  const [numLoaded, setNumLoaded] = useState(2);
  rewards = useMemo(() => {
    const finalReward = rewards.length > 0 ? rewards[rewards.length - 1] : {};
    const rewardsWithComment = rewards.filter(
      (reward) =>
        !stringIsEmpty(reward.rewardComment) && reward.id !== finalReward.id
    );
    const rewardsWithoutComment = rewards.filter(
      (reward) =>
        stringIsEmpty(reward.rewardComment) && reward.id !== finalReward.id
    );
    return rewardsWithoutComment
      .concat(rewardsWithComment)
      .concat(finalReward.id ? [finalReward] : []);
  }, [rewards]);
  const maxRewards = useMemo(() => returnMaxRewards({ rewardLevel }), [
    rewardLevel
  ]);
  const amountRewarded = useMemo(() => {
    let result = rewards.reduce(
      (prev, reward) => prev + reward.rewardAmount,
      0
    );
    result = Math.min(result, maxRewards);
    return result;
  }, [maxRewards, rewards]);

  return rewards && rewards.length > 0 ? (
    <ErrorBoundary>
      <div
        style={style}
        className={`${className} ${css`
          font-size: 1.6rem;
          padding: 0.4rem 1rem 0.2rem 1rem;
          color: #fff;
          display: flex;
          flex-direction: column;
          align-items: center;
          background: ${amountRewarded === maxRewards
            ? Color.gold()
            : amountRewarded >= 25
            ? Color.brownOrange()
            : Color.logoBlue()};
        `}`}
      >
        <Starmarks stars={amountRewarded} />
        <div
          className={css`
            font-size: 1.5rem;
            @media (max-width: ${mobileMaxWidth}) {
              font-size: 1.2rem;
            }
          `}
        >
          {amountRewarded} Twinkle
          {amountRewarded > 1 ? 's' : ''} (
          {addCommasToNumber(amountRewarded * 200)} XP) rewarded out of max{' '}
          {maxRewards}
        </div>
      </div>
      {numLoaded < rewards.length && (
        <LoadMoreButton
          color={
            amountRewarded === maxRewards || amountRewarded > 10
              ? 'orange'
              : 'lightBlue'
          }
          label="Show More Reward Records"
          filled
          style={{
            fontSize: '1.3rem',
            marginTop: '1rem'
          }}
          onClick={() => setNumLoaded(numLoaded + 3)}
        />
      )}
      {rewards
        .filter((reward, index) => index > rewards.length - numLoaded - 1)
        .map((reward) => (
          <Comment
            maxRewardables={Math.ceil(maxRewards / 2)}
            noMarginForEditButton={noMarginForEditButton}
            key={reward.id}
            reward={reward}
            myId={userId}
            onEditDone={onCommentEdit}
          />
        ))}
    </ErrorBoundary>
  ) : null;
}

export default memo(RewardStatus);
