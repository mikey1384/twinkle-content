import React from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import { css } from 'emotion';
import { borderRadius, Color } from 'constants/css';

GrammarReview.propTypes = {
  style: PropTypes.object
};

export default function GrammarReview({ style }) {
  return (
    <ErrorBoundary style={style}>
      <div
        className={css`
          background: #fff;
          border-radius: ${borderRadius};
          border: 1px solid ${Color.borderGray()};
          padding: 1rem;
        `}
      >
        <div>this is grammar review</div>
      </div>
    </ErrorBoundary>
  );
}
