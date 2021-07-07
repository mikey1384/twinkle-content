import React from 'react';
import PropTypes from 'prop-types';
import StepSlide from '../components/StepSlide';

ConnectReplToGitHub.propTypes = {
  index: PropTypes.number
};

export default function ConnectReplToGitHub({ index }) {
  return (
    <StepSlide title="Connect your Repl to GitHub" index={index}>
      <p>
        Follow the instructions in the tutorial to connect your Repl to your
        GitHub
      </p>
    </StepSlide>
  );
}
