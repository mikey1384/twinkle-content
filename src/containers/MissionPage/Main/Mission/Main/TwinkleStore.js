import React from 'react';
import PropTypes from 'prop-types';

TwinkleStore.propTypes = {
  mission: PropTypes.object.isRequired
};

export default function TwinkleStore({ mission }) {
  return (
    <div>
      <div>this is {mission.title}</div>
    </div>
  );
}
