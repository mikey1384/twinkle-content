import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/Icon';
import { returnMaxRewards } from 'constants/defaultValues';
import { useMyState } from 'helpers/hooks';

SelectRewardAmount.propTypes = {
  selectedAmount: PropTypes.number,
  onSetSelectedAmount: PropTypes.func,
  rewardLevel: PropTypes.number,
  rewards: PropTypes.array
};

export default function SelectRewardAmount({
  selectedAmount,
  onSetSelectedAmount,
  rewardLevel,
  rewards
}) {
  const { userId } = useMyState();

  const maxRewardAmountForOnePerson = useMemo(
    () => Math.min(returnMaxRewards({ rewardLevel }) / 2, 10),
    [rewardLevel]
  );

  const myRewardables = useMemo(() => {
    const prevRewards = rewards.reduce((prev, reward) => {
      if (reward.rewarderId === userId) {
        return prev + reward.rewardAmount;
      }
      return prev;
    }, 0);
    return maxRewardAmountForOnePerson - prevRewards;
  }, [maxRewardAmountForOnePerson, rewards, userId]);

  const remainingRewards = useMemo(() => {
    let currentRewards =
      rewards.length > 0
        ? rewards.reduce((prev, reward) => prev + reward.rewardAmount, 0)
        : 0;
    currentRewards = Math.min(currentRewards, maxRewardAmountForOnePerson);
    return maxRewardAmountForOnePerson - currentRewards;
  }, [maxRewardAmountForOnePerson, rewards]);

  return (
    <div
      style={{
        padding: '1.5rem',
        display: 'flex',
        width: '100%',
        fontSize: '3rem',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      {Array(Math.min(remainingRewards, myRewardables))
        .fill()
        .map((elem, index) => (
          <Icon
            key={index}
            icon={
              selectedAmount > index ? 'certificate' : ['far', 'certificate']
            }
            style={{ cursor: 'pointer', marginLeft: '0.5rem' }}
            onClick={() => onSetSelectedAmount(index + 1)}
          />
        ))}
    </div>
  );
}
