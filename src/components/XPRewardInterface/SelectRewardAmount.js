import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/Icon';

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
