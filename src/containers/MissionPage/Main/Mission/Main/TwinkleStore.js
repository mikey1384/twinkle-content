import React from 'react';
import PropTypes from 'prop-types';
import UsernameChangeItem from './username_change_item.png';

TwinkleStore.propTypes = {
  mission: PropTypes.object.isRequired
};

export default function TwinkleStore({ mission }) {
  return (
    <div>
      <img style={{ width: '100%' }} src={UsernameChangeItem} />
      <div>this is {mission.title}</div>
    </div>
  );
}
