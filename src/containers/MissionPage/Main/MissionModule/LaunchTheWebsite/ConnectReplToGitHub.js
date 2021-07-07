import React from 'react';
import PropTypes from 'prop-types';
import StepSlide from '../components/StepSlide';

ConnectReplToGitHub.propTypes = {
  index: PropTypes.number
};

export default function ConnectReplToGitHub({ index }) {
  return <StepSlide title="Connect to GitHub" index={index}></StepSlide>;
}
