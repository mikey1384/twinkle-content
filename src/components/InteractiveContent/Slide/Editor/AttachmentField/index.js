import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  exceedsCharLimit,
  stringIsEmpty,
  isValidYoutubeUrl,
  isValidUrl
} from 'helpers/stringHelpers';
import { edit } from 'constants/placeholders';
import Checkbox from 'components/Checkbox';
import FileField from './FileField';
import Input from 'components/Texts/Input';
import DropdownButton from 'components/Buttons/DropdownButton';

AttachmentField.propTypes = {
  isChanging: PropTypes.bool,
  isYouTubeVideo: PropTypes.bool,
  type: PropTypes.string,
  fileUrl: PropTypes.string,
  linkUrl: PropTypes.string,
  newAttachment: PropTypes.object,
  onSetAttachmentState: PropTypes.func.isRequired
};

export default function AttachmentField({
  isChanging,
  isYouTubeVideo,
  type,
  fileUrl,
  linkUrl,
  newAttachment,
  onSetAttachmentState
}) {
  const editedUrl = useMemo(() => {
    if (type === 'link') {
      return linkUrl || '';
    }
    return '';
  }, [linkUrl, type]);
  const urlError = useMemo(
    () =>
      !stringIsEmpty(editedUrl) &&
      ((isYouTubeVideo && !isValidYoutubeUrl(editedUrl)) ||
        !isValidUrl(editedUrl)),
    [editedUrl, isYouTubeVideo]
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
              onClick: () => onSetAttachmentState({ type: item })
            }))}
        />
      </div>
      {type !== 'none' && (
        <div style={{ width: '100%', marginTop: '1rem' }}>
          {type === 'file' ? (
            <FileField
              isChanging={isChanging}
              fileUrl={fileUrl}
              newAttachment={newAttachment}
              onSetAttachmentState={onSetAttachmentState}
            />
          ) : (
            <>
              <Input
                hasError={urlError}
                onChange={handleUrlChange}
                placeholder={edit.url}
                value={editedUrl}
                style={urlExceedsCharLimit?.style}
              />
              {(urlExceedsCharLimit || urlError) && (
                <small style={{ color: 'red', lineHeight: 0.5 }}>
                  {urlExceedsCharLimit?.message || 'Please check the url'}
                </small>
              )}
              <Checkbox
                label="YouTube Video:"
                onClick={() =>
                  onSetAttachmentState({ isYouTubeVideo: !isYouTubeVideo })
                }
                style={{ marginTop: '1rem' }}
                checked={isYouTubeVideo}
              />
            </>
          )}
        </div>
      )}
    </div>
  );

  function handleUrlChange(text) {
    onSetAttachmentState({
      linkUrl: text,
      isYouTubeVideo: isValidYoutubeUrl(text)
    });
  }
}
