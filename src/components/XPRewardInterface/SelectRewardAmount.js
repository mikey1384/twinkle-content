import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/Icon';
import { css } from 'emotion';
import { mobileMaxWidth } from 'constants/css';

SelectRewardAmount.propTypes = {
  selectedAmount: PropTypes.number,
  onSetSelectedAmount: PropTypes.func,
  remainingRewards: PropTypes.number,
  myRewardables: PropTypes.number
};

export default function SelectRewardAmount({
  selectedAmount,
  onSetSelectedAmount,
  remainingRewards,
  myRewardables
}) {
  return (
    <div
      className={css`
        padding: 1.5rem;
        display: flex;
        width: 100%;
        font-size: 3rem;
        justify-content: center;
        align-items: center;
        @media (max-width: ${mobileMaxWidth}) {
          font-size: 2rem;
        }
      `}
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
