import React from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import Icon from 'components/Icon';

UserView.propTypes = {
  onStartClick: PropTypes.func.isRequired,
  tutorialPrompt: PropTypes.string,
  tutorialButtonLabel: PropTypes.string
};

export default function UserView({
  onStartClick,
  tutorialPrompt,
  tutorialButtonLabel
}) {
  return (
    <div>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>
        {tutorialPrompt || 'Need help?'}
      </h2>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <Button
          style={{ marginLeft: '1rem', fontSize: '2rem' }}
          color="green"
          skeuomorphic
          onClick={onStartClick}
        >
          <Icon icon="chalkboard-teacher" />
          <span style={{ marginLeft: '1rem' }}>
            {tutorialButtonLabel || 'Press This Button'}
          </span>
        </Button>
      </div>
    </div>
  );
}
