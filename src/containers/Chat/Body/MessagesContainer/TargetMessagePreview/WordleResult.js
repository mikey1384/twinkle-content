import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/Icon';

WordleResult.propTypes = {
  onClose: PropTypes.func.isRequired
};

export default function WordleResult({ onClose }) {
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
