import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import LongText from 'components/Texts/LongText';
import CaptionEditor from './CaptionEditor';
import { stringIsEmpty } from 'helpers/stringHelpers';

Caption.propTypes = {
  caption: PropTypes.string,
  isEditing: PropTypes.bool
};

export default function Caption({ caption, isEditing }) {
  const [captionText, setCaptionText] = useState('');
  return (
    <ErrorBoundary>
      {stringIsEmpty(caption) || isEditing ? (
        <CaptionEditor text={captionText} onSetText={setCaptionText} />
      ) : (
        <LongText style={{ marginTop: '2rem' }}>{caption}</LongText>
      )}
    </ErrorBoundary>
  );
}
