import React from 'react';
import PropTypes from 'prop-types';
import { mobileMaxWidth } from 'constants/css';
import { css } from '@emotion/css';

StepSlide.propTypes = {
  children: PropTypes.node,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node])
};

export default function StepSlide({ children, title }) {
  return (
    <div
      className={css`
        width: 100%;
        min-height: 10rem;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        p {
          font-size: 2rem;
          font-weight: bold;
          @media (max-width: ${mobileMaxWidth}) {
            font-size: 1.7rem;
          }
        }
      `}
    >
      <p
        className={css`
          margin-bottom: 3rem;
        `}
      >
        {title}
      </p>
      {children}
    </div>
  );
}
