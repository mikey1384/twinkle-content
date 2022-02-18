import React from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import Content from './Content';
import { useMyState } from 'helpers/hooks';

Advertisement.propTypes = {
  style: PropTypes.object
};

export default function Advertisement({ style }) {
  const { userId } = useMyState();
  return userId ? null : (
    <ErrorBoundary>
      <Content style={style} />
    </ErrorBoundary>
  );
}
