import React from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';

FinalStep.propTypes = {
  style: PropTypes.object
};

export default function FinalStep({ style }) {
  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        ...style
      }}
    >
      <p>Great! You have unlocked change username item from Twinkle Store!</p>
      <p>Press this button to claim your reward</p>
      <Button skeuomorphic color="green">
        Press it
      </Button>
    </div>
  );
}
