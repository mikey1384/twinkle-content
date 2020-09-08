import React from 'react';
import PropTypes from 'prop-types';
import TakeScreenshot from './TakeScreenshot';

Submit.propTypes = {
  taskType: PropTypes.string
};

export default function Submit({ taskType }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {taskType === 'screenshot' && <TakeScreenshot />}
    </div>
  );
}
