import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/Icon';

WordleResult.propTypes = {
  onClose: PropTypes.func.isRequired,
  wordleResult: PropTypes.object.isRequired
};

export default function WordleResult({ onClose, wordleResult }) {
  console.log(wordleResult);
  return (
    <div>
      <Icon
        icon="times"
        size="lg"
        style={{
          position: 'absolute',
          right: '1.7rem',
          top: '4rem',
          cursor: 'pointer'
        }}
        onClick={onClose}
      />
      <div>wordle info</div>
    </div>
  );
}
