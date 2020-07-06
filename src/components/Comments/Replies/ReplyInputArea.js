import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import InputForm from 'components/Forms/InputForm';
import FileUploadStatusIndicator from 'components/FileUploadStatusIndicator';
import { useContentContext, useInputContext } from 'contexts';
import { useContentState } from 'helpers/hooks';
import { v1 as uuidv1 } from 'uuid';

ReplyInputArea.propTypes = {
  rootCommentId: PropTypes.number,
  innerRef: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onSubmitWithAttachment: PropTypes.func.isRequired,
  parent: PropTypes.object.isRequired,
  rows: PropTypes.number,
  style: PropTypes.object,
  targetCommentId: PropTypes.number
};

export default function ReplyInputArea({
  innerRef,
  onSubmit,
  onSubmitWithAttachment,
  parent,
  rootCommentId,
  style,
  targetCommentId,
  rows = 1
}) {
  const filePathRef = useRef(null);
  const {
    state,
    actions: { onSetCommentAttachment }
  } = useInputContext();
  const {
    fileUploadComplete,
    fileUploadProgress,
    uploadingFile
  } = useContentState({ contentId: targetCommentId, contentType: 'comment' });
  const {
    actions: { onSetCommentUploadingFile }
  } = useContentContext();

  const [commentContent, setCommentContent] = useState('');
  const attachment = state['comment' + targetCommentId]?.attachment;

  return (
    <ErrorBoundary>
      <div style={style}>
        {!uploadingFile && (
          <InputForm
            innerRef={innerRef}
            onSubmit={handleSubmit}
            parent={parent}
            placeholder="Enter your reply..."
            rows={rows}
            targetCommentId={targetCommentId}
          />
        )}
        {uploadingFile && (
          <FileUploadStatusIndicator
            style={{
              fontSize: '1.7rem',
              fontWeight: 'bold',
              marginTop: 0,
              width: '100%'
            }}
            fileName={attachment?.file?.name}
            onFileUpload={handleFileUploadComplete}
            uploadComplete={fileUploadComplete}
            uploadProgress={fileUploadProgress}
          />
        )}
      </div>
    </ErrorBoundary>
  );

  function handleFileUploadComplete() {
    filePathRef.current = uuidv1();
    onSubmitWithAttachment({
      attachment,
      commentContent,
      contentId: parent.contentId,
      contentType: parent.contentType,
      filePath: filePathRef.current,
      file: attachment.file,
      rootCommentId,
      subjectId: parent.subjectId,
      targetCommentId,
      isReply: true
    });
    setCommentContent('');
    onSetCommentAttachment({
      attachment: undefined,
      contentType: 'comment',
      contentId: targetCommentId
    });
    filePathRef.current = null;
  }

  function handleSubmit(text) {
    if (attachment?.contentType === 'file') {
      setCommentContent(text);
      onSetCommentUploadingFile({
        contentType: 'comment',
        contentId: targetCommentId,
        uploading: true
      });
    } else {
      onSubmit({
        content: text,
        rootCommentId,
        subjectId: parent.subjectId,
        targetCommentId
      });
    }
  }
}
