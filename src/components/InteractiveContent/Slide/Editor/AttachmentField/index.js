import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  exceedsCharLimit,
  stringIsEmpty,
  isValidYoutubeUrl
} from 'helpers/stringHelpers';
import { edit } from 'constants/placeholders';
import FileField from './FileField';
import Input from 'components/Texts/Input';
import DropdownButton from 'components/Buttons/DropdownButton';

AttachmentField.propTypes = {
  type: PropTypes.string,
  fileUrl: PropTypes.string,
  linkUrl: PropTypes.string,
  previewUri: PropTypes.string,
  onAttachmentTypeChange: PropTypes.func.isRequired,
  onEditedUrlChange: PropTypes.func.isRequired,
  onRemoveAttachment: PropTypes.func.isRequired,
  onSetAttachment: PropTypes.func.isRequired,
  onSetPreviewUri: PropTypes.func.isRequired
};

export default function AttachmentField({
  type,
  fileUrl,
  linkUrl,
  previewUri,
  onAttachmentTypeChange,
  onEditedUrlChange,
  onRemoveAttachment,
  onSetAttachment,
  onSetPreviewUri
}) {
  const editedUrl = useMemo(() => {
    if (type === 'link') {
      return linkUrl || '';
    }
    return '';
  }, [linkUrl, type]);
  const urlError = useMemo(
    () => !stringIsEmpty(editedUrl) && !isValidYoutubeUrl(editedUrl),
    [editedUrl]
  );
  const urlExceedsCharLimit = useMemo(
    () =>
      exceedsCharLimit({
        contentType: 'interactive',
        inputType: 'url',
        text: editedUrl
      }),
    [editedUrl]
  );

  return (
    <div
      style={{
        width: '100%',
        marginTop: type === 'file' ? '3rem' : '1rem',
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
        <p style={{ fontWeight: 'bold', fontSize: '1.7rem' }}>Attachment:</p>
        <DropdownButton
          skeuomorphic
          color="darkerGray"
          direction="right"
          icon="caret-down"
          text={type}
          style={{ marginLeft: '1rem' }}
          menuProps={['none', 'link', 'file']
            .filter((item) => item !== type)
            .map((item) => ({
              label: item.charAt(0).toUpperCase() + item.slice(1),
              onClick: () => onAttachmentTypeChange(item)
            }))}
        />
      </div>
      {type !== 'none' && (
        <div style={{ width: '100%', marginTop: '1rem' }}>
          {type === 'file' ? (
            <FileField
              fileUrl={fileUrl}
              previewUri={previewUri}
              onRemoveAttachment={onRemoveAttachment}
              onSetAttachment={onSetAttachment}
              onSetPreviewUri={onSetPreviewUri}
            />
          ) : (
            <>
              <Input
                hasError={urlError}
                onChange={onEditedUrlChange}
                placeholder={edit.url}
                value={editedUrl}
                style={urlExceedsCharLimit?.style}
              />
              {(urlExceedsCharLimit || urlError) && (
                <small style={{ color: 'red', lineHeight: 0.5 }}>
                  {urlExceedsCharLimit?.message || 'Please check the url'}
                </small>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
