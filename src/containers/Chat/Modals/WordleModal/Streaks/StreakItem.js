import React from 'react';
import PropTypes from 'prop-types';

StreakItem.propTypes = {
  streak: PropTypes.number.isRequired,
  streakObj: PropTypes.object.isRequired
};

export default function StreakItem({ streak, streakObj }) {
  return (
    <div key={streak}>
      {streak} {streakObj[streak][0].username}...
    </div>
  );
}
