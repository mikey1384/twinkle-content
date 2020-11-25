import React from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import LongText from 'components/Texts/LongText';
import { stringIsEmpty } from 'helpers/stringHelpers';

Caption.propTypes = {
  caption: PropTypes.string
};

export default function Caption({ caption }) {
  return (
    <ErrorBoundary>
      {stringIsEmpty(caption) ? (
        <div>No caption</div>
      ) : (
        <LongText style={{ marginTop: '2rem' }}>{caption}</LongText>
      )}
    </ErrorBoundary>
  );
}
