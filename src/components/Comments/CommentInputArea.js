import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import InputForm from 'components/Forms/InputForm';
import { useInputContext, useContentContext } from 'contexts';
import { useMyState } from 'helpers/hooks';
import Icon from '../Icon';
import Attachment from 'components/Attachment';
import Button from 'components/Button';
import AttachContentModal from 'components/AttachContentModal';
import FileUploadStatusIndicator from 'components/FileUploadStatusIndicator';
import { v1 as uuidv1 } from 'uuid';

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
    actions: { onSetSubjectAttachment }
  } = useInputContext();
  const {
    state: contentState,
    actions: { onSetCommentUploadingFile }
  } = useContentContext();
  const { profileTheme } = useMyState();
  const filePathRef = useRef(null);
  const [attachContentModalShown, setAttachContentModalShown] = useState(false);
  const [commentContent, setCommentContent] = useState('');
  const contentType = targetCommentId ? 'comment' : parent.contentType;
  const contentId = targetCommentId || parent.contentId;
  const attachment = state[contentType + contentId]?.attachment;
  const uploadingFile = contentState[contentType + contentId].uploadingFile;
  const fileUploadComplete =
    contentState[contentType + contentId].fileUploadComplete;
  const fileUploadProgress =
    contentState[contentType + contentId].fileUploadProgress;

  return (
    <div style={{ ...style, position: 'relative' }} ref={InputFormRef}>
      {!uploadingFile && (
        <div
          style={{
            display: 'flex',
            width: '100%'
          }}
        >
          <InputForm
            style={{
              width: 'CALC(100% - ' + (attachment ? 12 : 5) + 'rem)'
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
              attachment={attachment}
              onClose={() =>
                onSetSubjectAttachment({
                  attachment: undefined,
                  attachContentType: contentType + contentId
                })
              }
            />
          ) : (
            <Button
              skeuomorphic
              color={profileTheme}
              onClick={() => setAttachContentModalShown(true)}
              style={{
                height: '4rem',
                width: '4rem',
                marginLeft: '1rem'
              }}
            >
              <Icon size="lg" icon="plus" />
            </Button>
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
      {attachContentModalShown && (
        <AttachContentModal
          onHide={() => setAttachContentModalShown(false)}
          onConfirm={(content) => {
            onSetSubjectAttachment({
              attachment: content,
              attachContentType: contentType + contentId
            });
            setAttachContentModalShown(false);
          }}
          type="comment"
          contentType={contentType}
          contentId={contentId}
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
}
