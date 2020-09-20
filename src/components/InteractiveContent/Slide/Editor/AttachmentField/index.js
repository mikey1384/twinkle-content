import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import FileViewer from '../../FileViewer';
import {
  exceedsCharLimit,
  stringIsEmpty,
  isValidYoutubeUrl
} from 'helpers/stringHelpers';
import { edit } from 'constants/placeholders';
import { css } from 'emotion';
import Icon from 'components/Icon';
import Button from 'components/Button';
import Input from 'components/Texts/Input';
import DropdownButton from 'components/Buttons/DropdownButton';

AttachmentField.propTypes = {
  type: PropTypes.string,
  fileUrl: PropTypes.string,
  linkUrl: PropTypes.string,
  onAttachmentTypeChange: PropTypes.func.isRequired,
  onEditedUrlChange: PropTypes.func.isRequired,
  onRemoveAttachment: PropTypes.func.isRequired
};

export default function AttachmentField({
  type,
  fileUrl,
  linkUrl,
  onAttachmentTypeChange,
  onEditedUrlChange,
  onRemoveAttachment
}) {
  const editedUrl = useMemo(() => {
    if (type === 'link') {
      return linkUrl;
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
        <p style={{ fontWeight: 'bold', fontSize: '1.7rem' }}>
          Attachment Type:
        </p>
        <DropdownButton
          skeuomorphic
          color="darkerGray"
          direction="right"
          icon="caret-down"
          text={type === 'link' ? 'link' : 'file'}
          style={{ marginLeft: '1rem' }}
          menuProps={[
            {
              label: type === 'link' ? 'File' : 'Link',
              onClick: onAttachmentTypeChange
            }
          ]}
        />
      </div>
      <div style={{ width: '100%' }}>
        {type === 'file' ? (
          <div style={{ position: 'relative' }}>
            <Button
              skeuomorphic
              className={css`
                opacity: 0.9;
                &:hover {
                  opacity: 1;
                }
              `}
              style={{
                position: 'absolute',
                right: 3,
                top: 3,
                padding: '0.6rem'
              }}
              onClick={onRemoveAttachment}
            >
              <Icon icon="times" size="lg" />
            </Button>
            <FileViewer src={fileUrl} />
          </div>
        ) : type === 'link' ? (
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
