import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { cloudFrontURL } from 'constants/defaultValues';
import {
  exceedsCharLimit,
  stringIsEmpty,
  isValidYoutubeUrl
} from 'helpers/stringHelpers';
import { edit } from 'constants/placeholders';
import Input from 'components/Texts/Input';

AttachmentField.propTypes = {
  type: PropTypes.string,
  src: PropTypes.string,
  onEditedUrlChange: PropTypes.func
};

export default function AttachmentField({ type, src, onEditedUrlChange }) {
  const editedUrl = useMemo(() => {
    if (type === 'youtube') {
      return src;
    }
    return '';
  }, [src, type]);
  const urlError = useMemo(
    () => !stringIsEmpty(editedUrl) && isValidYoutubeUrl(editedUrl),
    [editedUrl]
  );
  const urlExceedsCharLimit = useMemo(
    () =>
      exceedsCharLimit({
        contentType: 'interactive',
        inputType: 'youtube',
        text: editedUrl
      }),
    [editedUrl]
  );

  switch (type) {
    case 'image':
      return (
        <div style={{ width: '80%', marginTop: '3rem' }}>
          <img style={{ width: '100%' }} src={`${cloudFrontURL}${src}`} />
        </div>
      );
    case 'youtube':
      return (
        <div>
          <Input
            hasError={urlError}
            onChange={onEditedUrlChange}
            placeholder={edit.video}
            value={editedUrl}
            style={urlExceedsCharLimit?.style}
          />
          {(urlExceedsCharLimit || urlError) && (
            <small style={{ color: 'red', lineHeight: 0.5 }}>
              {urlExceedsCharLimit?.message || 'Please check the url'}
            </small>
          )}
        </div>
      );
    default:
      return null;
  }
}
