import React from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import { panel } from './Styles';

Leaderboard.propTypes = {
  style: PropTypes.object
};

export default function Leaderboard({ style }) {
  return (
    <ErrorBoundary>
      <div style={style} className={panel}>
        Annual Leaderboard
      </div>
    </ErrorBoundary>
  );
}
