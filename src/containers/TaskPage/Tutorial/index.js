import React from 'react';
import PropTypes from 'prop-types';
import StartPanel from './StartPanel';

Tutorial.propTypes = {
  style: PropTypes.object
};

export default function Tutorial({ style }) {
  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        justifyContent: 'center',
        ...style
      }}
    >
      <StartPanel />
    </div>
  );
}
