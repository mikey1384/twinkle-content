import React from 'react';
import PropTypes from 'prop-types';
import StepSlide from '../components/StepSlide';
import { Color } from 'constants/css';

UpdateYourRepl.propTypes = {
  index: PropTypes.number
};

export default function UpdateYourRepl({ index }) {
  return (
    <StepSlide
      title={
        <>
          Remember the Repl we made earlier?
          <br />
          The code we used for that Repl is no longer needed.
          <br />
          <span style={{ color: Color.logoBlue() }}>
            Replace that code with the one below which we wrote for our website.
          </span>
        </>
      }
      index={index}
    ></StepSlide>
  );
}
