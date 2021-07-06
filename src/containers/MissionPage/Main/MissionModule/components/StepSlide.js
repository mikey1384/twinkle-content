import React from 'react';
import PropTypes from 'prop-types';
import { mobileMaxWidth } from 'constants/css';
import { css } from '@emotion/css';

StepSlide.propTypes = {
  children: PropTypes.node,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  style: PropTypes.object,
  index: PropTypes.number
};

export default function StepSlide({ children, title, style, index }) {
  return (
    <div
      style={style}
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
          line-height: 1.7;
          @media (max-width: ${mobileMaxWidth}) {
            font-size: 1.7rem;
          }
        }
      `}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        <div>
          <p>{index + 1}. </p>
        </div>
        <div style={{ marginLeft: '0.7rem' }}>
          <p
            className={css`
              margin-bottom: 3rem;
            `}
          >
            {title}
          </p>
        </div>
      </div>
      {children}
    </div>
  );
}
