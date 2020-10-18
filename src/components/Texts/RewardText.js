import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/Icon';
import { addCommasToNumber } from 'helpers/stringHelpers';
import { Color } from 'constants/css';

RewardText.propTypes = {
  xpReward: PropTypes.number,
  coinReward: PropTypes.number
};

export default function RewardText({ xpReward, coinReward }) {
  return xpReward || coinReward ? (
    <div
      style={{
        marginTop: '2rem',
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <p style={{ fontWeight: 'bold', fontSize: '1.7rem' }}>Reward:</p>
      <div
        style={{
          fontSize: '1.5rem',
          marginLeft: '1rem',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        {xpReward && (
          <div>
            <span style={{ fontWeight: 'bold', color: Color.logoGreen() }}>
              {addCommasToNumber(xpReward)}
            </span>{' '}
            <span style={{ color: Color.gold(), fontWeight: 'bold' }}>XP</span>
            {coinReward && ','}
          </div>
        )}
        {coinReward && (
          <div
            style={{
              color: Color.brownOrange(),
              marginLeft: xpReward ? '0.8rem' : 0,
              fontWeight: 'bold'
            }}
          >
            <Icon icon={['far', 'badge-dollar']} /> {coinReward}
          </div>
        )}
      </div>
    </div>
  ) : null;
}
