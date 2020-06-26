import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/Icon';
import Button from 'components/Button';
import { addCommasToNumber } from 'helpers/stringHelpers';

MenuButtons.propTypes = {
  maxRewards: PropTypes.number.isRequired,
  onSetSelectedAmount: PropTypes.func.isRequired,
  onSetStarTabActive: PropTypes.func.isRequired,
  selectedAmount: PropTypes.number.isRequired,
  rewards: PropTypes.array.isRequired,
  starTabActive: PropTypes.bool.isRequired,
  userId: PropTypes.number
};

export default function MenuButtons({
  maxRewards,
  onSetSelectedAmount,
  onSetStarTabActive,
  selectedAmount,
  rewards,
  starTabActive,
  userId
}) {
  const maxRewardable = useMemo(() => Math.ceil(maxRewards / 2), [maxRewards]);
  const myRewardables = useMemo(() => {
    const prevRewards = rewards.reduce((prev, reward) => {
      if (reward.rewarderId === userId) {
        return prev + reward.rewardAmount;
      }
      return prev;
    }, 0);
    return maxRewardable - prevRewards;
  }, [maxRewardable, rewards, userId]);
  const remainingRewards = useMemo(() => {
    let currentRewards =
      rewards.length > 0
        ? rewards.reduce((prev, reward) => prev + reward.rewardAmount, 0)
        : 0;
    currentRewards = Math.min(currentRewards, maxRewards);
    return maxRewards - currentRewards;
  }, [maxRewards, rewards]);
  const multiplier = starTabActive ? 5 : 1;
  const buttons = useMemo(() => {
    const result = [];
    for (
      let i = 1;
      i * multiplier <=
      Math.min(remainingRewards, myRewardables, starTabActive ? 25 : 4);
      i++
    ) {
      result.push(
        <Button
          key={i * multiplier}
          color={
            !(i === maxRewardable && maxRewardable < 5) && i * multiplier < 5
              ? 'logoBlue'
              : (i === maxRewardable && maxRewardable < 5) ||
                i * multiplier >= 25
              ? 'gold'
              : 'pink'
          }
          style={{
            justifyContent: 'flex-start',
            marginTop: i !== 1 && '0.5rem'
          }}
          onClick={() => onSetSelectedAmount(i * multiplier)}
          filled={selectedAmount === i * multiplier}
        >
          {renderStars({ numStars: i, starTabActive })}
          <span style={{ marginLeft: '0.7rem' }}>
            Reward {i * multiplier === 1 ? 'a' : i * multiplier} Twinkle
            {i * multiplier > 1 ? 's' : ''} (
            {addCommasToNumber(i * multiplier * 200)} XP)
          </span>
        </Button>
      );
    }
    if (!starTabActive && Math.min(remainingRewards, myRewardables) >= 5) {
      result.push(
        <Button
          color="pink"
          key={5}
          onClick={() => onSetStarTabActive(true)}
          style={{
            justifyContent: 'flex-start',
            marginTop: '0.5rem'
          }}
        >
          <Icon icon="star" />
          <span style={{ marginLeft: '0.7rem' }}>
            Reward Stars (×5 Twinkles)
          </span>
        </Button>
      );
    }
    return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    maxRewardable,
    multiplier,
    myRewardables,
    remainingRewards,
    selectedAmount,
    starTabActive
  ]);

  return buttons.length > 0 ? (
    buttons
  ) : (
    <div
      style={{
        textAlign: 'center',
        padding: '2rem 0 2rem 0',
        fontWeight: 'bold'
      }}
    >
      Cannot reward more than {Math.min(remainingRewards, myRewardables)}{' '}
      Twinkle
      {Math.min(remainingRewards, myRewardables) > 1 ? 's' : ''}
    </div>
  );

  function renderStars({ numStars, starTabActive }) {
    const result = [];
    for (let i = 0; i < numStars; i++) {
      result.push(
        <Icon
          key={i}
          icon={starTabActive ? 'star' : 'certificate'}
          style={{ marginLeft: i !== 0 && '0.2rem' }}
        />
      );
    }
    return result;
  }
}
