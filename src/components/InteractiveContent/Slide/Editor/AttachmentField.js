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
import DropdownButton from 'components/Buttons/DropdownButton';

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
    () => !stringIsEmpty(editedUrl) && !isValidYoutubeUrl(editedUrl),
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

  return (
    <div
      style={{
        width: '100%',
        marginTop: type === 'image' ? '3rem' : '1rem',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          marginTop: '1rem',
          marginBottom: '1rem'
        }}
      >
        <p style={{ fontWeight: 'bold', fontSize: '1.7rem' }}>
          Attachment Type:
        </p>
        <DropdownButton
          skeuomorphic
          color="darkerGray"
          direction="right"
          icon="caret-down"
          text={type === 'youtube' ? 'youtube' : 'file'}
          style={{ marginLeft: '1rem' }}
          menuProps={[
            {
              label: type === 'youtube' ? 'File' : 'YouTube',
              onClick: () => console.log('clicked')
            }
          ]}
        />
      </div>
      <div style={{ width: '100%' }}>
        {type === 'image' ? (
          <img style={{ width: '100%' }} src={`${cloudFrontURL}${src}`} />
        ) : type === 'youtube' ? (
          <>
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
          </>
        ) : null}
      </div>
    </div>
  );
}
