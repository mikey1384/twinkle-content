import React from 'react';
import PropTypes from 'prop-types';
import StepSlide from '../components/StepSlide';
import { Color } from 'constants/css';

ConnectReplToGitHub.propTypes = {
  index: PropTypes.number,
  okayPressed: PropTypes.bool
};

export default function ConnectReplToGitHub({ index, okayPressed }) {
  return (
    <StepSlide title="Connect your Repl to GitHub" index={index}>
      <div
        style={{
          marginBottom: okayPressed ? '2rem' : '2.5rem',
          textAlign: 'center'
        }}
      >
        <p>
          Follow the instructions in the{' '}
          <b style={{ color: Color.green() }}>tutorial</b> to connect your Repl
          to your GitHub.
        </p>
        {okayPressed && (
          <div style={{ marginTop: '4rem' }}>
            <p>Were you able to connect your Repl to your GitHub?</p>
          </div>
        )}
      </div>
    </StepSlide>
  );
}
