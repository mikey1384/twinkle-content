import React, { useState, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import InputForm from 'components/Forms/InputForm';
import { useInputContext, useContentContext } from 'contexts';
import { useMyState } from 'helpers/hooks';
import Icon from '../Icon';
import Attachment from 'components/Attachment';
import Button from 'components/Button';
import FileUploadStatusIndicator from 'components/FileUploadStatusIndicator';
import { v1 as uuidv1 } from 'uuid';
import { FILE_UPLOAD_XP_REQUIREMENT, mb } from 'constants/defaultValues';
import AlertModal from 'components/Modals/AlertModal';
import {
  getFileInfoFromFileName,
  addCommasToNumber
} from 'helpers/stringHelpers';
import FullTextReveal from 'components/Texts/FullTextReveal';

CommentInputArea.propTypes = {
  autoFocus: PropTypes.bool,
  clickListenerState: PropTypes.bool,
  inputTypeLabel: PropTypes.string,
  innerRef: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  InputFormRef: PropTypes.object,
  numInputRows: PropTypes.number,
  onSubmit: PropTypes.func.isRequired,
  onSubmitWithAttachment: PropTypes.func,
  parent: PropTypes.object.isRequired,
  rootCommentId: PropTypes.number,
  subjectId: PropTypes.number,
  targetCommentId: PropTypes.number,
  style: PropTypes.object
};

export default function CommentInputArea({
  autoFocus,
  clickListenerState,
  innerRef,
  inputTypeLabel,
  InputFormRef,
  numInputRows = 4,
  onSubmitWithAttachment,
  onSubmit,
  parent,
  rootCommentId,
  subjectId,
  style,
  targetCommentId
}) {
  const {
    state,
    actions: { onSetCommentAttachment }
  } = useInputContext();
  const {
    state: contentState,
    actions: { onSetCommentUploadingFile }
  } = useContentContext();
  const { userId, profileTheme, authLevel, twinkleXP } = useMyState();
  const filePathRef = useRef(null);
  const FileInputRef = useRef(null);
  const [alertModalShown, setAlertModalShown] = useState(false);
  const [onHover, setOnHover] = useState(false);
  const [commentContent, setCommentContent] = useState('');
  const contentType = targetCommentId ? 'comment' : parent.contentType;
  const contentId = targetCommentId || parent.contentId;
  const attachment = state[contentType + contentId]?.attachment;
  const uploadingFile = contentState[contentType + contentId].uploadingFile;
  const fileUploadComplete =
    contentState[contentType + contentId].fileUploadComplete;
  const fileUploadProgress =
    contentState[contentType + contentId].fileUploadProgress;

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

  const disabled = useMemo(
    () => authLevel === 0 && twinkleXP < FILE_UPLOAD_XP_REQUIREMENT,
    [authLevel, twinkleXP]
  );

  return (
    <div style={{ ...style, position: 'relative' }} ref={InputFormRef}>
      {!uploadingFile && (
        <div
          style={{
            display: 'flex',
            width: '100%',
            justifyContent: 'space-between'
          }}
        >
          <InputForm
            style={{
              width: '100%'
            }}
            innerRef={innerRef}
            clickListenerState={clickListenerState}
            autoFocus={autoFocus}
            onSubmit={handleSubmit}
            parent={
              subjectId
                ? { contentId: subjectId, contentType: 'subject' }
                : parent
            }
            rows={numInputRows}
            placeholder={`Enter your ${inputTypeLabel} here...`}
            targetCommentId={targetCommentId}
          />
          {attachment ? (
            <Attachment
              style={{ marginLeft: '1rem', fontSize: '1rem' }}
              attachment={attachment}
              onClose={() =>
                onSetCommentAttachment({
                  attachment: undefined,
                  contentType,
                  contentId
                })
              }
            />
          ) : (
            <div>
              {userId && (
                <Button
                  skeuomorphic
                  color={profileTheme}
                  onClick={() =>
                    disabled ? null : FileInputRef.current.click()
                  }
                  onMouseEnter={() => setOnHover(true)}
                  onMouseLeave={() => setOnHover(false)}
                  style={{
                    height: '4rem',
                    width: '4rem',
                    marginLeft: '1rem',
                    opacity: disabled ? 0.2 : 1,
                    cursor: disabled ? 'default' : 'pointer'
                  }}
                >
                  <Icon size="lg" icon="upload" />
                </Button>
              )}
              {userId && disabled && (
                <FullTextReveal
                  text={
                    'Requires ' +
                    addCommasToNumber(FILE_UPLOAD_XP_REQUIREMENT) +
                    ' XP'
                  }
                  show={onHover}
                />
              )}
            </div>
          )}
        </div>
      )}
      {uploadingFile && (
        <FileUploadStatusIndicator
          style={{ fontSize: '1.7rem', fontWeight: 'bold', marginTop: 0 }}
          fileName={attachment?.file?.name}
          onFileUpload={handleFileUploadComplete}
          uploadComplete={fileUploadComplete}
          uploadProgress={fileUploadProgress}
        />
      )}
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
    </div>
  );

  function handleFileUploadComplete() {
    filePathRef.current = uuidv1();
    onSubmitWithAttachment({
      attachment,
      commentContent,
      contentId,
      contentType,
      filePath: filePathRef.current,
      file: attachment.file,
      rootCommentId,
      subjectId,
      targetCommentId
    });
    setCommentContent('');
    onSetCommentAttachment({
      attachment: undefined,
      contentType,
      contentId
    });
    filePathRef.current = null;
  }

  function handleSubmit(text) {
    if (attachment?.contentType === 'file') {
      setCommentContent(text);
      onSetCommentUploadingFile({
        contentType,
        contentId,
        uploading: true
      });
    } else {
      onSubmit({
        content: text,
        subjectId,
        rootCommentId,
        targetCommentId,
        attachment,
        contentType,
        contentId
      });
    }
  }

  function handleUpload(event) {
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
          onSetCommentAttachment({
            attachment: {
              file: fileObj,
              contentType: 'file',
              fileType,
              imageUrl: payload
            },
            contentType,
            contentId
          });
        } else {
          window.loadImage(
            payload,
            function (img) {
              const imageUrl = img.toDataURL('image/jpeg');
              const dataUri = imageUrl.replace(/^data:image\/\w+;base64,/, '');
              const buffer = Buffer.from(dataUri, 'base64');
              const file = new File([buffer], fileObj.name);

              onSetCommentAttachment({
                attachment: {
                  file,
                  contentType: 'file',
                  fileType,
                  imageUrl
                },
                contentType,
                contentId
              });
            },
            { orientation: true, canvas: true }
          );
        }
      };
      reader.readAsDataURL(fileObj);
    } else {
      onSetCommentAttachment({
        attachment: {
          file: fileObj,
          contentType: 'file',
          fileType
        },
        contentType,
        contentId
      });
    }
    event.target.value = null;
  }
}
