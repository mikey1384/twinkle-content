import React from 'react';
import PropTypes from 'prop-types';
import StepSlide from '../../components/StepSlide';
import { mobileMaxWidth } from 'constants/css';
import { css } from '@emotion/css';

CreateNewRepl.propTypes = {
  index: PropTypes.number,
  okayPressed: PropTypes.bool
};

export default function CreateNewRepl({ index, okayPressed }) {
  return (
    <StepSlide index={index} title={<>Create a Next.js Repl</>}>
      {okayPressed && (
        <p
          className={css`
            margin-top: 4.5rem;
            margin-bottom: 3.5rem;
            font-size: 2rem;
            font-weight: bold;
            @media (max-width: ${mobileMaxWidth}) {
              font-size: 1.7rem;
            }
          `}
        >
          Did you create a Next.js Repl?
        </p>
      )}
    </StepSlide>
  );
}
