import React from 'react';
import PropTypes from 'prop-types';
import PreviewErrorBoundary from './PreviewErrorBoundary';
import { css } from '@emotion/css';

Preview.propTypes = {
  style: PropTypes.object,
  children: PropTypes.node
};

export default function Preview({ style, children }) {
  return (
    <PreviewErrorBoundary
      style={{
        width: '100%',
        ...style
      }}
      className={css`
        font-size: 1rem;
        p {
          font-size: 1rem;
          font-family: none;
          font-weight: normal;
          display: block;
          margin-block-start: 1em;
          margin-block-end: 1em;
          margin-inline-start: 0px;
          margin-inline-end: 0px;
        }
      `}
    >
      {children}
    </PreviewErrorBoundary>
  );
}