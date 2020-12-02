import React from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';

StartScreen.propTypes = {
  onStartButtonClick: PropTypes.func.isRequired
};

export default function StartScreen({ onStartButtonClick }) {
  return (
    <div style={{ textAlign: 'center', width: '100%', marginTop: '3rem' }}>
      <h3>When you are ready, press the button below to begin the challenge</h3>
      <div
        style={{
          display: 'flex',
          height: '10rem',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Button
          color="green"
          filled
          style={{ fontSize: '2rem' }}
          onClick={onStartButtonClick}
        >
          Begin
        </Button>
      </div>
    </div>
  );
}
