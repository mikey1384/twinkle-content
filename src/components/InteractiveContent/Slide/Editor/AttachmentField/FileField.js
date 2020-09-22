import React, { useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import Icon from 'components/Icon';
import FileViewer from '../../FileViewer';
import AlertModal from 'components/Modals/AlertModal';
import FileContent from 'components/FileContent';
import { mb } from 'constants/defaultValues';
import { useMyState } from 'helpers/hooks';
import { getFileInfoFromFileName } from 'helpers/stringHelpers';
import { css } from 'emotion';

FileField.propTypes = {
  isChanging: PropTypes.bool,
  fileUrl: PropTypes.string,
  newAttachment: PropTypes.object,
  onSetAttachmentState: PropTypes.func.isRequired
};

export default function FileField({
  isChanging,
  fileUrl,
  newAttachment,
  onSetAttachmentState
}) {
  const { authLevel } = useMyState();
  const maxSize = useMemo(
    () =>
      authLevel > 3
        ? 5000 * mb
        : authLevel > 1
        ? 3000 * mb
        : authLevel === 1
        ? 1000 * mb
        : 300 * mb,
    [authLevel]
  );
  const [alertModalShown, setAlertModalShown] = useState(false);
  const FileInputRef = useRef(null);

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {!(isChanging || !fileUrl) ? (
        <>
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
            onClick={() => onSetAttachmentState({ isChanging: true })}
          >
            <Icon icon="times" size="lg" />
          </Button>
          <FileViewer src={fileUrl} />
        </>
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '1rem'
          }}
        >
          {newAttachment && (
            <FileContent
              file={newAttachment.file}
              fileType={newAttachment.fileType}
              imageUrl={newAttachment.imageUrl}
              fileIconSize="10x"
              fileNameLength={50}
              fileNameStyle={{ fontSize: '1.5rem', lineHeight: 2.5 }}
              imageBackgroundColor="#fff"
              style={{ width: '100%', marginBottom: '2rem', height: 'auto' }}
            />
          )}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'column'
            }}
          >
            <Button onClick={() => FileInputRef.current.click()} skeuomorphic>
              <Icon icon="upload" />
              <span style={{ marginLeft: '0.7rem' }}>
                Select {newAttachment ? 'another' : 'a'} file
              </span>
            </Button>
            {fileUrl && (
              <Button
                onClick={() =>
                  onSetAttachmentState({
                    isChanging: false,
                    newAttachment: undefined
                  })
                }
                style={{ marginTop: '1rem' }}
                skeuomorphic
              >
                Cancel
              </Button>
            )}
          </div>
        </div>
      )}
      <input
        ref={FileInputRef}
        style={{ display: 'none' }}
        type="file"
        onChange={handleFileSelection}
      />
      {alertModalShown && (
        <AlertModal
          title="File is too large"
          content={`The file size is larger than your limit of ${
            maxSize / mb
          } MB`}
          onHide={() => setAlertModalShown(false)}
        />
      )}
    </div>
  );

  function handleFileSelection(event) {
    const fileObj = event.target.files[0];
    if (fileObj.size / mb > maxSize) {
      return setAlertModalShown(true);
    }
    const { fileType } = getFileInfoFromFileName(fileObj.name);
    if (fileType === 'image') {
      const reader = new FileReader();
      reader.onload = (upload) => {
        const payload = upload.target.result;
        if (fileObj.name.split('.')[1] === 'gif') {
          onSetAttachmentState({
            newAttachment: {
              fileType,
              file: fileObj,
              imageUrl: payload
            }
          });
        } else {
          window.loadImage(
            payload,
            function (img) {
              const imageUri = img.toDataURL('image/jpeg');
              const dataUri = imageUri.replace(/^data:image\/\w+;base64,/, '');
              const buffer = Buffer.from(dataUri, 'base64');
              const file = new File([buffer], fileObj.name);
              onSetAttachmentState({
                newAttachment: {
                  fileType,
                  file,
                  imageUrl: imageUri
                }
              });
            },
            { orientation: true, canvas: true }
          );
        }
      };
      reader.readAsDataURL(fileObj);
    } else {
      onSetAttachmentState({
        newAttachment: {
          file: fileObj,
          contentType: 'file',
          fileType
        }
      });
    }
    event.target.value = null;
  }
}
