import React, { useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import Icon from 'components/Icon';
import AlertModal from 'components/Modals/AlertModal';
import ErrorBoundary from 'components/ErrorBoundary';
import { isMobile } from 'helpers';
import { Color } from 'constants/css';
import { useMyState } from 'helpers/hooks';
import {
  addCommasToNumber,
  getFileInfoFromFileName
} from 'helpers/stringHelpers';
import { useInputContext } from 'contexts';
import { FILE_UPLOAD_XP_REQUIREMENT } from 'constants/defaultValues';

StartScreen.propTypes = {
  navigateTo: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
<<<<<<< HEAD:src/containers/Home/Stories/InputPanel/SubjectInput/AttachContentModal/StartScreen.js
  attachContentType: PropTypes.string.isRequired
};

export default function StartScreen({ navigateTo, onHide, attachContentType }) {
=======
  type: PropTypes.string,
  contentType: PropTypes.string,
  contentId: PropTypes.number
};

export default function StartScreen({
  navigateTo,
  onHide,
  type,
  contentType,
  contentId
}) {
>>>>>>> aaa9216901c5aca08561159c23d556321bb3d602:src/components/AttachContentModal/StartScreen.js
  const {
    actions: { onSetSubjectAttachment }
  } = useInputContext();
  const { authLevel, twinkleXP } = useMyState();
  const [alertModalShown, setAlertModalShown] = useState(false);
  const FileInputRef = useRef(null);
  const mb = 1000;
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
  const disabled = useMemo(() => {
    if (authLevel > 1) return false;
    if (twinkleXP >= FILE_UPLOAD_XP_REQUIREMENT) return false;
    return true;
  }, [authLevel, twinkleXP]);

  return (
    <ErrorBoundary style={{ display: 'flex', width: '100%' }}>
      <div
        style={{
          width: '50%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <div
          style={{
            fontWeight: 'bold',
            fontSize: '2rem',
            color: Color.black()
          }}
        >
          Upload from your {isMobile(navigator) ? 'device' : 'computer'}
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '1.5rem'
          }}
        >
          <Button
            skeuomorphic
            style={{ fontSize: '3.5rem', padding: '1.5rem' }}
            color="blue"
            onClick={() => FileInputRef.current.click()}
            disabled={disabled}
          >
            <Icon icon="upload" />
          </Button>
          {disabled && (
            <div
              style={{
                marginTop: '1rem',
                fontWeight: 'bold'
              }}
            >{`Requires ${addCommasToNumber(
              FILE_UPLOAD_XP_REQUIREMENT
            )} XP`}</div>
          )}
        </div>
      </div>
      <div
        style={{
          width: '50%',
          flexDirection: 'column',
          alignItems: 'center',
          display: 'flex',
          marginLeft: '1rem'
        }}
      >
        <div
          style={{
            fontWeight: 'bold',
            fontSize: '2rem',
            color: Color.black()
          }}
        >
          Select from Twinkle Website
        </div>
        <div
          style={{
            marginTop: '2.5rem',
            display: 'flex'
          }}
        >
          <Button
            skeuomorphic
            style={{ fontSize: '2rem' }}
            color="logoBlue"
            onClick={() => navigateTo('selectVideo')}
          >
            <Icon icon="film" />
            <span style={{ marginLeft: '1rem' }}>Video</span>
          </Button>
          <Button
            skeuomorphic
            style={{ fontSize: '2rem', marginLeft: '1rem' }}
            color="pink"
            onClick={() => navigateTo('selectLink')}
          >
            <Icon icon="link" />
            <span style={{ marginLeft: '1rem' }}>Link</span>
          </Button>
        </div>
      </div>
      <input
        ref={FileInputRef}
        style={{ display: 'none' }}
        type="file"
        onChange={handleUpload}
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
    </ErrorBoundary>
  );

  function handleUpload(event) {
    const key = contentType + contentId;
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
          onSetSubjectAttachment(
            {
              file: fileObj,
              contentType: 'file',
              fileType,
              imageUrl: payload
            },
            attachContentType
          );
          onHide();
        } else {
          window.loadImage(
            payload,
            function (img) {
              const imageUrl = img.toDataURL('image/jpeg');
              const dataUri = imageUrl.replace(/^data:image\/\w+;base64,/, '');
              const buffer = Buffer.from(dataUri, 'base64');
              const file = new File([buffer], fileObj.name);
<<<<<<< HEAD:src/containers/Home/Stories/InputPanel/SubjectInput/AttachContentModal/StartScreen.js
              onSetSubjectAttachment(
                {
=======

              onSetSubjectAttachment({
                attachment: {
>>>>>>> aaa9216901c5aca08561159c23d556321bb3d602:src/components/AttachContentModal/StartScreen.js
                  file,
                  contentType: 'file',
                  fileType,
                  imageUrl
                },
<<<<<<< HEAD:src/containers/Home/Stories/InputPanel/SubjectInput/AttachContentModal/StartScreen.js
                attachContentType
              );
=======
                attachContentType: type === 'subject' ? 'subject' : key
              });
>>>>>>> aaa9216901c5aca08561159c23d556321bb3d602:src/components/AttachContentModal/StartScreen.js
              onHide();
            },
            { orientation: true, canvas: true }
          );
        }
      };
      reader.readAsDataURL(fileObj);
    } else {
<<<<<<< HEAD:src/containers/Home/Stories/InputPanel/SubjectInput/AttachContentModal/StartScreen.js
      onSetSubjectAttachment(
        {
=======
      onSetSubjectAttachment({
        attachment: {
>>>>>>> aaa9216901c5aca08561159c23d556321bb3d602:src/components/AttachContentModal/StartScreen.js
          file: fileObj,
          contentType: 'file',
          fileType
        },
<<<<<<< HEAD:src/containers/Home/Stories/InputPanel/SubjectInput/AttachContentModal/StartScreen.js
        attachContentType
      );
=======
        attachContentType: type === 'subject' ? 'subject' : key
      });
>>>>>>> aaa9216901c5aca08561159c23d556321bb3d602:src/components/AttachContentModal/StartScreen.js
      onHide();
    }
    event.target.value = null;
  }
}
