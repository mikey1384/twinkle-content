import React from 'react';
import PropTypes from 'prop-types';
import StepSlide from '../components/StepSlide';

ConnectToGitHub.propTypes = {
  index: PropTypes.number
};

export default function ConnectToGitHub({ index }) {
  return <StepSlide title="Connect to GitHub" index={index}></StepSlide>;
}
