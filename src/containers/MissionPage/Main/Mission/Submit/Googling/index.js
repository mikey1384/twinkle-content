import React from 'react';
import PropTypes from 'prop-types';
import Question from './Question';

Googling.propTypes = {
  style: PropTypes.object
};
export default function Googling({ style }) {
  return (
    <div style={style}>
      <Question />
    </div>
  );
}
