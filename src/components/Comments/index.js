import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Context from './Context';
import CommentInputArea from './CommentInputArea';
import Comment from './Comment';
import LoadMoreButton from 'components/Buttons/LoadMoreButton';
import Loading from 'components/Loading';
import PinnedComment from './PinnedComment';
import { scrollElementToCenter } from 'helpers';
import { css } from '@emotion/css';
import { Color, mobileMaxWidth } from 'constants/css';
import { useAppContext, useContentContext, useInputContext } from 'contexts';

Comments.propTypes = {
  autoExpand: PropTypes.bool,
  autoFocus: PropTypes.bool,
  commentsHidden: PropTypes.bool,
  numPreviews: PropTypes.number,
  className: PropTypes.string,
  commentsShown: PropTypes.bool,
  comments: PropTypes.array.isRequired,
  commentsLoadLimit: PropTypes.number,
  inputAreaInnerRef: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  inputAtBottom: PropTypes.bool,
  inputTypeLabel: PropTypes.string,
  isLoading: PropTypes.bool,
  loadMoreButton: PropTypes.bool.isRequired,
  numInputRows: PropTypes.number,
  noInput: PropTypes.bool,
  onCommentSubmit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onEditDone: PropTypes.func.isRequired,
  onLikeClick: PropTypes.func.isRequired,
  onLoadMoreComments: PropTypes.func.isRequired,
  onLoadMoreReplies: PropTypes.func.isRequired,
  onPreviewClick: PropTypes.func,
  onLoadRepliesOfReply: PropTypes.func,
  onReplySubmit: PropTypes.func.isRequired,
  onRewardCommentEdit: PropTypes.func.isRequired,
  parent: PropTypes.shape({
    commentId: PropTypes.number,
    contentId: PropTypes.number.isRequired,
    contentType: PropTypes.string.isRequired,
    pinnedCommentId: PropTypes.number
  }).isRequired,
  rootContent: PropTypes.object,
  showSecretButtonAvailable: PropTypes.bool,
  style: PropTypes.object,
  subject: PropTypes.object,
  userId: PropTypes.number
};

function Comments({
  autoFocus,
  autoExpand,
  comments = [],
  commentsHidden,
  commentsLoadLimit,
  commentsShown,
  className,
  inputAreaInnerRef,
  inputAtBottom,
  inputTypeLabel,
  isLoading,
  loadMoreButton,
  noInput,
  numInputRows,
  numPreviews,
  onCommentSubmit,
  onDelete,
  onEditDone,
  onLikeClick,
  onLoadRepliesOfReply,
  onLoadMoreComments,
  onLoadMoreReplies,
  onPreviewClick = () => {},
  onReplySubmit,
  onRewardCommentEdit,
  parent,
  rootContent,
  showSecretButtonAvailable,
  subject,
  style,
  userId
}) {
  const {
    requestHelpers: { deleteContent, loadComments, uploadComment, uploadFile }
  } = useAppContext();
  const {
    actions: { onEnterComment }
  } = useInputContext();
  const {
    actions: {
      onClearCommentFileUploadProgress,
      onUpdateCommentFileUploadProgress,
      onSetCommentFileUploadComplete
    }
  } = useContentContext();
  const [deleting, setDeleting] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [commentSubmitted, setCommentSubmitted] = useState(false);
  const [prevComments, setPrevComments] = useState(comments);
  const ContainerRef = useRef(null);
  const CommentInputAreaRef = useRef(null);
  const CommentRefs = {};

  useEffect(() => {
    if (comments.length < prevComments.length && deleting) {
      setDeleting(false);
      if (comments.length === 0) {
        return scrollElementToCenter(ContainerRef.current);
      }
      if (
        comments[comments.length - 1].id !==
        prevComments[prevComments.length - 1].id
      ) {
        scrollElementToCenter(CommentRefs[comments[comments.length - 1].id]);
      }
    }
    if (
      inputAtBottom &&
      commentSubmitted &&
      comments.length > prevComments.length &&
      (prevComments.length === 0 ||
        comments[comments.length - 1].id >
          prevComments[prevComments.length - 1].id)
    ) {
      setCommentSubmitted(false);
      scrollElementToCenter(CommentRefs[comments[comments.length - 1].id]);
    }
    if (
      !inputAtBottom &&
      commentSubmitted &&
      comments.length > prevComments.length &&
      (prevComments.length === 0 || comments[0].id > prevComments[0].id)
    ) {
      setCommentSubmitted(false);
      scrollElementToCenter(CommentRefs[comments[0].id]);
    }
    setPrevComments(comments);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [comments]);

  useEffect(() => {
    if (!autoExpand && !commentSubmitted && autoFocus && commentsShown) {
      scrollElementToCenter(CommentInputAreaRef.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commentsShown]);
  const previewComments = useMemo(
    () =>
      numPreviews > 0 && !commentsShown
        ? comments.filter((comment, index) => index < numPreviews)
        : [],
    [comments, commentsShown, numPreviews]
  );
  const isPreview = useMemo(() => previewComments.length > 0, [
    previewComments.length
  ]);

  return (
    <Context.Provider
      value={{
        onDelete: handleDeleteComment,
        onEditDone,
        onLikeClick,
        onLoadMoreReplies,
        onRewardCommentEdit,
        onReplySubmit: handleSubmitReply,
        onLoadRepliesOfReply,
        onSubmitWithAttachment: handleFileUpload
      }}
    >
      <div
        className={`${
          isPreview && !(commentsShown || autoExpand)
            ? css`
                &:hover {
                  background: ${Color.highlightGray()};
                }
                @media (max-width: ${mobileMaxWidth}) {
                  &:hover {
                    background: #fff;
                  }
                }
              `
            : ''
        } ${className}`}
        style={style}
        ref={ContainerRef}
        onClick={isPreview ? onPreviewClick : () => {}}
      >
        {!inputAtBottom &&
          !noInput &&
          (commentsShown || autoExpand) &&
          renderInputArea()}
        {(commentsShown || autoExpand || numPreviews > 0) && !commentsHidden && (
          <div
            style={{
              width: '100%'
            }}
          >
            {isLoading && <Loading />}
            {!isLoading && parent.pinnedCommentId && !isPreview && (
              <PinnedComment
                parent={parent}
                rootContent={rootContent}
                subject={subject}
                commentId={parent.pinnedCommentId}
                userId={userId}
              />
            )}
            {inputAtBottom && loadMoreButton && renderLoadMoreButton()}
            {!isLoading &&
              (isPreview ? previewComments : comments).map((comment) => (
                <Comment
                  isPreview={isPreview}
                  innerRef={(ref) => (CommentRefs[comment.id] = ref)}
                  parent={parent}
                  rootContent={rootContent}
                  subject={subject}
                  comment={comment}
                  pinnedCommentId={parent.pinnedCommentId}
                  key={comment.id}
                  userId={userId}
                />
              ))}
            {!inputAtBottom && loadMoreButton && renderLoadMoreButton()}
          </div>
        )}
        {inputAtBottom &&
          !noInput &&
          (commentsShown || autoExpand) &&
          renderInputArea({
            marginTop: comments.length > 0 ? '1rem' : 0
          })}
      </div>
    </Context.Provider>
  );

  function renderInputArea(style) {
    return (
      <CommentInputArea
        autoFocus={autoFocus}
        InputFormRef={CommentInputAreaRef}
        innerRef={inputAreaInnerRef}
        inputTypeLabel={inputTypeLabel}
        numInputRows={numInputRows}
        onSubmit={handleSubmitComment}
        onViewSecretAnswer={
          showSecretButtonAvailable ? handleViewSecretAnswer : null
        }
        parent={parent}
        rootCommentId={
          parent.contentType === 'comment' ? parent.commentId : null
        }
        subjectId={subject?.id}
        style={style}
        targetCommentId={
          parent.contentType === 'comment' ? parent.contentId : null
        }
      />
    );
  }

  function renderLoadMoreButton() {
    return (autoExpand || commentsShown) && !isLoading ? (
      <LoadMoreButton
        filled
        color="lightBlue"
        loading={isLoadingMore}
        onClick={handleLoadMoreComments}
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          marginTop: inputAtBottom ? 0 : '1rem'
        }}
      />
    ) : null;
  }

  async function handleFileUpload({
    attachment,
    commentContent,
    contentType,
    contentId,
    filePath,
    file,
    rootCommentId,
    subjectId,
    targetCommentId,
    isReply
  }) {
    const finalContentType = targetCommentId
      ? 'comment'
      : subjectId
      ? 'subject'
      : contentType;
    const finalContentId = targetCommentId || subjectId || contentId;
    try {
      setCommentSubmitted(true);
      await uploadFile({
        filePath,
        file,
        onUploadProgress: handleUploadProgress
      });
      onSetCommentFileUploadComplete({
        contentType: finalContentType,
        contentId: finalContentId
      });
      const data = await uploadComment({
        content: commentContent,
        parent,
        rootCommentId,
        subjectId,
        targetCommentId,
        attachment,
        filePath,
        fileName: file.name,
        fileSize: file.size
      });
      if (isReply) {
        onReplySubmit({
          ...data,
          contentId: parent.contentId,
          contentType: parent.contentType
        });
      } else {
        onCommentSubmit({
          ...data,
          contentId: targetCommentId || parent.contentId,
          contentType: targetCommentId ? 'comment' : parent.contentType
        });
      }
      onClearCommentFileUploadProgress({
        contentType: finalContentType,
        contentId: finalContentId
      });
      onEnterComment({
        contentType: finalContentType,
        contentId: finalContentId,
        text: ''
      });
    } catch (error) {
      console.error(error);
    }
    function handleUploadProgress({ loaded, total }) {
      onUpdateCommentFileUploadProgress({
        contentType: finalContentType,
        contentId: finalContentId,
        progress: loaded / total
      });
    }
  }

  async function handleSubmitComment({
    content,
    rootCommentId,
    subjectId,
    targetCommentId
  }) {
    try {
      setCommentSubmitted(true);
      const data = await uploadComment({
        content,
        parent,
        rootCommentId,
        subjectId,
        targetCommentId
      });
      await onCommentSubmit({
        ...data,
        contentId: parent.contentId,
        contentType: parent.contentType
      });
      return Promise.resolve();
    } catch (error) {
      console.error(error);
    }
  }

  async function handleViewSecretAnswer() {
    try {
      setCommentSubmitted(true);
      const data = await uploadComment({
        content: 'viewed the secret message',
        parent,
        subjectId:
          parent.contentType === 'subject' ? parent.contentId : subject.id,
        isNotification: true
      });
      await onCommentSubmit({
        ...data,
        contentId: parent.contentId,
        contentType: parent.contentType
      });
    } catch (error) {
      console.error(error);
    }
  }

  async function handleSubmitReply({
    content,
    rootCommentId,
    targetCommentId
  }) {
    setCommentSubmitted(true);
    const data = await uploadComment({
      content,
      parent,
      rootCommentId,
      targetCommentId
    });
    onReplySubmit({
      ...data,
      contentId: parent.contentId,
      contentType: parent.contentType
    });
  }

  async function handleLoadMoreComments() {
    if (!isLoadingMore) {
      setIsLoadingMore(true);
      const lastCommentLocation = inputAtBottom ? 0 : comments.length - 1;
      const lastCommentId = comments[lastCommentLocation]
        ? comments[lastCommentLocation].id
        : 'undefined';
      try {
        const data = await loadComments({
          contentId: parent.contentId,
          contentType: parent.contentType,
          lastCommentId,
          limit: commentsLoadLimit
        });
        onLoadMoreComments({
          ...data,
          contentId: parent.contentId,
          contentType: parent.contentType
        });
        setIsLoadingMore(false);
      } catch (error) {
        console.error(error.response || error);
      }
    }
  }

  async function handleDeleteComment(commentId) {
    setDeleting(true);
    await deleteContent({ id: commentId, contentType: 'comment' });
    onDelete(commentId);
  }
}

export default memo(Comments);
