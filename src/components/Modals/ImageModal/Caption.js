import React from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import LongText from 'components/Texts/LongText';
import CaptionEditor from 'components/Texts/CaptionEditor';
import { stringIsEmpty } from 'helpers/stringHelpers';

Caption.propTypes = {
  editedCaption: PropTypes.string,
  onSetEditedCaption: PropTypes.func,
  caption: PropTypes.string,
  isEditing: PropTypes.bool
};

export default function Caption({
  caption,
  isEditing,
  editedCaption,
  onSetEditedCaption
}) {
  return (
    <ErrorBoundary>
      {stringIsEmpty(caption) || isEditing ? (
        <CaptionEditor
          style={{ marginTop: '2rem' }}
          text={editedCaption}
          onSetText={onSetEditedCaption}
        />
      ) : (
        <LongText style={{ marginTop: '2rem' }}>{caption}</LongText>
      )}
    </ErrorBoundary>
  );
}
