import React, { useContext, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import InputForm from 'components/Forms/InputForm';
import FileUploadStatusIndicator from 'components/FileUploadStatusIndicator';
import LocalContext from './Context';
import { useInputContext } from 'contexts';
import { useContentState } from 'helpers/hooks';
import { v1 as uuidv1 } from 'uuid';

CommentInputArea.propTypes = {
  autoFocus: PropTypes.bool,
  clickListenerState: PropTypes.bool,
  inputTypeLabel: PropTypes.string,
  innerRef: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  InputFormRef: PropTypes.object,
  numInputRows: PropTypes.number,
  onSubmit: PropTypes.func.isRequired,
  onViewSecretAnswer: PropTypes.func,
  parent: PropTypes.object.isRequired,
  rootCommentId: PropTypes.number,
  subjectId: PropTypes.number,
  style: PropTypes.object,
  targetCommentId: PropTypes.number
};

export default function CommentInputArea({
  autoFocus,
  clickListenerState,
  innerRef,
  inputTypeLabel,
  InputFormRef,
  numInputRows = 4,
  onSubmit,
  onViewSecretAnswer,
  parent,
  rootCommentId,
  subjectId,
  style,
  targetCommentId
}) {
  const contentType = targetCommentId
    ? 'comment'
    : subjectId
    ? 'subject'
    : parent.contentType;
  const contentId = targetCommentId || subjectId || parent.contentId;
  const { onSubmitWithAttachment } = useContext(LocalContext);
  const {
    state,
    actions: { onSetCommentAttachment }
  } = useInputContext();

  const { fileUploadComplete, fileUploadProgress } = useContentState({
    contentId,
    contentType
  });

  const filePathRef = useRef(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [commentContent, setCommentContent] = useState('');
  const attachment = state[contentType + contentId]?.attachment;

  return (
    <div style={{ ...style, position: 'relative' }} ref={InputFormRef}>
      {!uploadingFile && (
        <InputForm
          innerRef={innerRef}
          clickListenerState={clickListenerState}
          autoFocus={autoFocus}
          onSubmit={handleSubmit}
          onViewSecretAnswer={onViewSecretAnswer}
          parent={{ contentId, contentType }}
          rows={numInputRows}
          placeholder={`Enter your ${inputTypeLabel} here...`}
          targetCommentId={targetCommentId}
        />
      )}
      {uploadingFile && (
        <FileUploadStatusIndicator
          style={{
            fontSize: '1.7rem',
            fontWeight: 'bold',
            marginTop: 0,
            paddingBottom: '1rem'
          }}
          fileName={attachment?.file?.name}
          onFileUpload={handleFileUpload}
          uploadComplete={fileUploadComplete}
          uploadProgress={fileUploadProgress}
        />
      )}
    </div>
  );

  function handleFileUpload() {
    filePathRef.current = uuidv1();
    handleSubmitWithAttachment();
    setCommentContent('');
    onSetCommentAttachment({
      attachment: undefined,
      contentType,
      contentId
    });
    filePathRef.current = null;

    async function handleSubmitWithAttachment() {
      await onSubmitWithAttachment({
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
      setUploadingFile(false);
    }
  }

  async function handleSubmit(text) {
    if (attachment) {
      setCommentContent(text);
      setUploadingFile(true);
    } else {
      await onSubmit({
        content: text,
        rootCommentId,
        subjectId,
        targetCommentId
      });
      return Promise.resolve();
    }
  }
}
