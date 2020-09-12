import React from 'react';
import PropTypes from 'prop-types';
import TakeScreenshot from './TakeScreenshot';

Submit.propTypes = {
  missionType: PropTypes.string
};

export default function Submit({ missionType }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {missionType === 'screenshot' && <TakeScreenshot />}
    </div>
  );
}
