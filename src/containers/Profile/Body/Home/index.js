import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import SectionPanel from 'components/SectionPanel';
import Comments from 'components/Comments';
import Intro from './Intro';
import Achievements from './Achievements';
import Pictures from './Pictures';
import ErrorBoundary from 'components/ErrorBoundary';
import { useContentState, useMyState } from 'helpers/hooks';
import { useAppContext, useContentContext } from 'contexts';
import { css } from '@emotion/css';
import { mobileMaxWidth } from 'constants/css';
import localize from 'constants/localize';

const messageBoardLabel = localize('messageBoard');

Home.propTypes = {
  profile: PropTypes.object,
  selectedTheme: PropTypes.string.isRequired
};

export default function Home({ profile, selectedTheme }) {
  const loadComments = useAppContext((v) => v.requestHelpers.loadComments);
  const { userId } = useMyState();
  const onDeleteComment = useContentContext((v) => v.actions.onDeleteComment);
  const onEditComment = useContentContext((v) => v.actions.onEditComment);
  const onEditRewardComment = useContentContext(
    (v) => v.actions.onEditRewardComment
  );
  const onLikeComment = useContentContext((v) => v.actions.onLikeComment);
  const onLoadComments = useContentContext((v) => v.actions.onLoadComments);
  const onLoadMoreComments = useContentContext(
    (v) => v.actions.onLoadMoreComments
  );
  const onLoadMoreReplies = useContentContext(
    (v) => v.actions.onLoadMoreReplies
  );
  const onLoadRepliesOfReply = useContentContext(
    (v) => v.actions.onLoadRepliesOfReply
  );
  const onUploadComment = useContentContext((v) => v.actions.onUploadComment);
  const onUploadReply = useContentContext((v) => v.actions.onUploadReply);

  const { id, numPics, username, pictures } = profile;
  const { comments, commentsLoaded, commentsLoadMoreButton, pinnedCommentId } =
    useContentState({
      contentType: 'user',
      contentId: profile.id
    });
  const [loadingComments, setLoadingComments] = useState(false);
  const CommentInputAreaRef = useRef(null);

  useEffect(() => {
    if (!commentsLoaded) {
      initComments();
    }
    async function initComments() {
      try {
        setLoadingComments(true);
        const { comments, loadMoreButton } = await loadComments({
          contentId: id,
          contentType: 'user',
          limit: 5
        });
        onLoadComments({
          contentId: profile.id,
          contentType: 'user',
          comments,
          loadMoreButton
        });
        setLoadingComments(false);
      } catch (error) {
        console.error(error);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <ErrorBoundary
      componentPath="Profile/Body/Home/index"
      className={css`
        width: 70vw;
        @media (max-width: ${mobileMaxWidth}) {
          width: 100vw;
        }
      `}
    >
      <Intro profile={profile} selectedTheme={selectedTheme} />
      {userId && (
        <Pictures
          profileId={profile.id}
          numPics={numPics}
          pictures={pictures}
          selectedTheme={selectedTheme}
        />
      )}
      <Achievements
        selectedTheme={selectedTheme}
        profile={profile}
        myId={userId}
      />
      {(userId !== profile.id || comments.length > 0 || loadingComments) && (
        <SectionPanel
          customColorTheme={selectedTheme}
          loaded
          title={messageBoardLabel}
        >
          <Comments
            comments={comments}
            commentsLoadLimit={5}
            commentsShown={true}
            contentId={id}
            inputAreaInnerRef={CommentInputAreaRef}
            inputTypeLabel={`message to ${username}`}
            isLoading={loadingComments}
            loadMoreButton={commentsLoadMoreButton}
            noInput={id === userId}
            numPreviews={1}
            onCommentSubmit={onUploadComment}
            onDelete={onDeleteComment}
            onEditDone={onEditComment}
            onLikeClick={onLikeComment}
            onLoadMoreComments={onLoadMoreComments}
            onLoadMoreReplies={onLoadMoreReplies}
            onLoadRepliesOfReply={onLoadRepliesOfReply}
            onPreviewClick={onLoadComments}
            onReplySubmit={onUploadReply}
            onRewardCommentEdit={onEditRewardComment}
            parent={{
              ...profile,
              pinnedCommentId: pinnedCommentId || profile.pinnedCommentId,
              contentType: 'user'
            }}
            userId={userId}
          />
        </SectionPanel>
      )}
      <div
        className={css`
          display: block;
          height: 7rem;
        `}
      />
    </ErrorBoundary>
  );
}
