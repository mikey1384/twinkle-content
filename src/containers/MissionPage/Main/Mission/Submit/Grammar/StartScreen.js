import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';

StartScreen.propTypes = {
  onInitMission: PropTypes.func.isRequired,
  onStartButtonClick: PropTypes.func.isRequired
};

export default function StartScreen({ onInitMission, onStartButtonClick }) {
  useEffect(() => {
    onInitMission();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ textAlign: 'center', width: '100%', marginTop: '4rem' }}>
      <h3>When you are ready, press the button below to begin the challenge</h3>
      <div
        style={{
          display: 'flex',
          marginTop: '3rem',
          paddingBottom: '2rem',
          justifyContent: 'center'
        }}
      >
        <Button
          color="green"
          filled
          style={{ fontSize: '2rem' }}
          onClick={onStartButtonClick}
        >
          Begin!
        </Button>
      </div>
    </div>
  );
}
