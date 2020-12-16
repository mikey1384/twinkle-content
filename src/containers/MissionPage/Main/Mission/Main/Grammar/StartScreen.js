import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';

StartScreen.propTypes = {
  numQuestions: PropTypes.number,
  onInitMission: PropTypes.func.isRequired,
  onStartButtonClick: PropTypes.func.isRequired
};

export default function StartScreen({
  numQuestions,
  onInitMission,
  onStartButtonClick
}) {
  useEffect(() => {
    onInitMission();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ textAlign: 'center', width: '100%', marginTop: '3rem' }}>
      <h3>Correctly answer all {numQuestions} grammar questions</h3>
      <p
        style={{ marginTop: '2rem', fontSize: '1.7rem' }}
      >{`When you are ready, press "Start"`}</p>
      <div
        style={{
          display: 'flex',
          marginTop: '4.5rem',
          paddingBottom: '1.5rem',
          justifyContent: 'center'
        }}
      >
        <Button
          color="green"
          filled
          style={{ fontSize: '2.3rem' }}
          onClick={onStartButtonClick}
        >
          Start
        </Button>
      </div>
    </div>
  );
}
