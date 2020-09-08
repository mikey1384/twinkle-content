import React from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';

Submit.propTypes = {
  buttonLabel: PropTypes.string,
  taskType: PropTypes.string
};

export default function Submit({ buttonLabel, taskType }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {taskType && <div>{taskType}</div>}
      <div
        style={{ display: 'flex', justifyContent: 'center', marginTop: '5rem' }}
      >
        <Button
          color="darkBlue"
          skeuomorphic
          style={{ fontSize: '2rem' }}
          onClick={() => console.log('clicked')}
        >
          {buttonLabel || 'Submit'}
        </Button>
      </div>
    </div>
  );
}
