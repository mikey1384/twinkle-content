import React, { useContext, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import InputForm from 'components/Forms/InputForm';
import FileUploadStatusIndicator from 'components/FileUploadStatusIndicator';
import LocalContext from './Context';
import { useInputContext, useContentContext } from 'contexts';
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
  onSubmit,
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

  const {
    actions: { onSetCommentUploadingFile }
  } = useContentContext();

  const {
    fileUploadComplete,
    fileUploadProgress,
    uploadingFile
  } = useContentState({
    contentId,
    contentType
  });

  const filePathRef = useRef(null);
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
          onFileUpload={handleFileUploadComplete}
          uploadComplete={fileUploadComplete}
          uploadProgress={fileUploadProgress}
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
    if (attachment) {
      setCommentContent(text);
      onSetCommentUploadingFile({
        contentType,
        contentId,
        uploading: true
      });
    } else {
      onSubmit({
        content: text,
        rootCommentId,
        subjectId,
        targetCommentId
      });
    }
  }
}
