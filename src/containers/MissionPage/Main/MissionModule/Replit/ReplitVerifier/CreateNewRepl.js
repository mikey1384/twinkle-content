import React from 'react';
import PropTypes from 'prop-types';
import StepSlide from '../../components/StepSlide';
import { css } from '@emotion/css';

CreateNewRepl.propTypes = {
  index: PropTypes.number,
  innerRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  okayPressed: PropTypes.bool
};

export default function CreateNewRepl({ index, innerRef, okayPressed }) {
  return (
    <StepSlide
      innerRef={innerRef}
      index={index}
      title={<>Create a Next.js Repl</>}
    >
      {okayPressed && (
        <h1
          className={css`
            margin-top: 4.5rem;
            margin-bottom: 3.5rem;
          `}
        >
          Did you create a Next.js Repl?
        </h1>
      )}
    </StepSlide>
  );
}
