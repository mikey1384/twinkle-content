import React, { memo, useContext, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import LocalContext from '../Context';
import DropdownButton from 'components/Buttons/DropdownButton';
import EditTextArea from 'components/Texts/EditTextArea';
import Icon from 'components/Icon';
import Likers from 'components/Likers';
import UserListModal from 'components/Modals/UserListModal';
import UsernameText from 'components/Texts/UsernameText';
import ProfilePic from 'components/ProfilePic';
import Button from 'components/Button';
import LikeButton from 'components/Buttons/LikeButton';
import ReplyInputArea from './ReplyInputArea';
import ConfirmModal from 'components/Modals/ConfirmModal';
import LongText from 'components/Texts/LongText';
import RecommendationInterface from 'components/RecommendationInterface';
import RecommendationStatus from 'components/RecommendationStatus';
import LoginToViewContent from 'components/LoginToViewContent';
import RewardStatus from 'components/RewardStatus';
import XPRewardInterface from 'components/XPRewardInterface';
import ContentFileViewer from 'components/ContentFileViewer';
import { commentContainer } from '../Styles';
import { Link } from 'react-router-dom';
import { Color } from 'constants/css';
import { determineUserCanRewardThis, determineXpButtonDisabled } from 'helpers';
import { useContentState, useMyState } from 'helpers/hooks';
import { timeSince } from 'helpers/timeStampHelpers';
import { useAppContext, useContentContext } from 'contexts';
import { getFileInfoFromFileName, stringIsEmpty } from 'helpers/stringHelpers';

Reply.propTypes = {
  comment: PropTypes.shape({
    id: PropTypes.number.isRequired
  }),
  innerRef: PropTypes.func,
  deleteReply: PropTypes.func.isRequired,
  onLoadRepliesOfReply: PropTypes.func,
  onPinReply: PropTypes.func,
  onSubmitWithAttachment: PropTypes.func.isRequired,
  parent: PropTypes.object.isRequired,
  pinnedCommentId: PropTypes.number,
  reply: PropTypes.shape({
    commentId: PropTypes.number.isRequired,
    content: PropTypes.string.isRequired,
    deleted: PropTypes.bool,
    filePath: PropTypes.string,
    fileName: PropTypes.string,
    fileSize: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    thumbUrl: PropTypes.string,
    id: PropTypes.number.isRequired,
    likes: PropTypes.array,
    numReplies: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    originType: PropTypes.string,
    recommendations: PropTypes.array,
    profilePicUrl: PropTypes.string,
    replyId: PropTypes.number,
    rewards: PropTypes.array,
    targetObj: PropTypes.object,
    targetUserId: PropTypes.number,
    targetUserName: PropTypes.string,
    timeStamp: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    uploader: PropTypes.object.isRequired
  }),
  rootContent: PropTypes.object,
  subject: PropTypes.object,
  onSubmitReply: PropTypes.func.isRequired
};

function Reply({
  comment,
  innerRef = () => {},
  deleteReply,
  onLoadRepliesOfReply,
  onPinReply,
  onSubmitWithAttachment,
  parent,
  pinnedCommentId,
  reply,
  reply: {
    likes = [],
    recommendations = [],
    rewards = [],
    uploader,
    filePath,
    fileName,
    fileSize
  },
  rootContent,
  onSubmitReply,
  subject
}) {
  const {
    requestHelpers: { editContent, loadReplies }
  } = useAppContext();
  const {
    authLevel,
    canDelete,
    canEdit,
    canReward,
    twinkleCoins,
    userId
  } = useMyState();
  const {
    actions: { onSetIsEditing, onSetXpRewardInterfaceShown }
  } = useContentContext();
  const {
    deleted,
    isEditing,
    thumbUrl,
    xpRewardInterfaceShown
  } = useContentState({
    contentType: 'comment',
    contentId: reply.id
  });
  const { onEditDone, onLikeClick, onRewardCommentEdit } = useContext(
    LocalContext
  );
  const { fileType } = getFileInfoFromFileName(fileName);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [userListModalShown, setUserListModalShown] = useState(false);
  const [confirmModalShown, setConfirmModalShown] = useState(false);
  const [
    recommendationInterfaceShown,
    setRecommendationInterfaceShown
  ] = useState(false);
  const ReplyInputAreaRef = useRef(null);
  const RewardInterfaceRef = useRef(null);
  const userIsUploader = userId === uploader.id;
  const userIsSubjectUploader = useMemo(
    () =>
      userId &&
      parent.contentType === 'subject' &&
      parent.uploader?.id === userId,
    [parent.contentType, parent.uploader?.id, userId]
  );
  const userIsHigherAuth = authLevel > uploader.authLevel;

  const isRecommendedByUser = useMemo(() => {
    return (
      recommendations.filter(
        (recommendation) => recommendation.userId === userId
      ).length > 0
    );
  }, [recommendations, userId]);

  const isRewardedByUser = useMemo(() => {
    return rewards.filter((reward) => reward.rewarderId === userId).length > 0;
  }, [rewards, userId]);

  const dropdownButtonShown = useMemo(() => {
    const userCanEditThis = (canEdit || canDelete) && userIsHigherAuth;
    return userIsUploader || userIsSubjectUploader || userCanEditThis;
  }, [
    canDelete,
    canEdit,
    userIsHigherAuth,
    userIsSubjectUploader,
    userIsUploader
  ]);

  const userCanRewardThis = useMemo(
    () =>
      determineUserCanRewardThis({
        canReward,
        authLevel,
        recommendations,
        uploader,
        userId
      }),
    [authLevel, canReward, recommendations, uploader, userId]
  );

  const rewardLevel = useMemo(() => {
    if (parent.contentType === 'subject' && parent.rewardLevel > 0) {
      return parent.rewardLevel;
    }
    if (parent.rootType === 'subject' && rootContent?.rewardLevel > 0) {
      return rootContent.rewardLevel;
    }
    if (parent.contentType === 'video' || parent.contentType === 'url') {
      if (subject?.rewardLevel) {
        return subject?.rewardLevel;
      }
      if (parent.rewardLevel > 0) {
        return 1;
      }
    }
    if (parent.rootType === 'video' || parent.rootType === 'url') {
      if (subject?.rewardLevel) {
        return subject?.rewardLevel;
      }
      if (rootContent?.rewardLevel > 0) {
        return 1;
      }
    }
    return 0;
  }, [
    parent.contentType,
    parent.rewardLevel,
    parent.rootType,
    rootContent,
    subject
  ]);

  const xpButtonDisabled = useMemo(
    () =>
      determineXpButtonDisabled({
        myId: userId,
        rewardLevel,
        xpRewardInterfaceShown,
        rewards
      }),
    [userId, rewardLevel, xpRewardInterfaceShown, rewards]
  );

  const dropdownMenuItems = useMemo(() => {
    const items = [];
    if (userIsSubjectUploader) {
      items.push({
        label: (
          <>
            <Icon icon={['fas', 'thumbtack']} />
            <span style={{ marginLeft: '1rem' }}>
              {pinnedCommentId === reply.id ? 'Unpin' : 'Pin'}
            </span>
          </>
        ),
        onClick: () =>
          onPinReply(pinnedCommentId === reply.id ? null : reply.id)
      });
    }
    if (userIsUploader || canEdit) {
      items.push({
        label: (
          <>
            <Icon icon="pencil-alt" />
            <span style={{ marginLeft: '1rem' }}>Edit</span>
          </>
        ),
        onClick: () =>
          onSetIsEditing({
            contentId: reply.id,
            contentType: 'comment',
            isEditing: true
          })
      });
    }
    if (userIsUploader || canDelete) {
      items.push({
        label: (
          <>
            <Icon icon="trash-alt" />
            <span style={{ marginLeft: '1rem' }}>Remove</span>
          </>
        ),
        onClick: () => setConfirmModalShown(true)
      });
    }
    return items;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    canDelete,
    canEdit,
    pinnedCommentId,
    reply.id,
    userIsSubjectUploader,
    userIsUploader
  ]);

  return !deleted && !reply.deleted ? (
    <ErrorBoundary>
      <div className={commentContainer} ref={innerRef}>
        {pinnedCommentId === reply.id && (
          <div
            style={{
              lineHeight: 1,
              fontSize: '1.3rem',
              fontWeight: 'bold',
              color: Color.darkerGray(),
              marginBottom: '0.2rem'
            }}
          >
            <Icon icon={['fas', 'thumbtack']} />
            <span style={{ marginLeft: '0.7rem' }}>
              Pinned by {parent.uploader?.username}
            </span>
          </div>
        )}
        <div className="content-wrapper">
          <aside>
            <ProfilePic
              style={{ height: '5rem', width: '5rem' }}
              userId={uploader.id}
              profilePicUrl={uploader.profilePicUrl}
            />
          </aside>
          {dropdownButtonShown && !isEditing && (
            <div className="dropdown-wrapper">
              <DropdownButton
                skeuomorphic
                icon="chevron-down"
                color="darkerGray"
                direction="left"
                opacity={0.8}
                menuProps={dropdownMenuItems}
              />
            </div>
          )}
          <section>
            <div>
              <UsernameText className="username" user={uploader} />{' '}
              <small className="timestamp">
                <Link to={`/comments/${reply.id}`}>
                  {timeSince(reply.timeStamp)}
                </Link>
              </small>
            </div>
            <div>
              {reply.targetObj?.comment?.uploader &&
                !!reply.replyId &&
                reply.replyId !== comment.id && (
                  <ErrorBoundary>
                    <span className="to">
                      to:{' '}
                      <UsernameText user={reply.targetObj.comment.uploader} />
                    </span>
                  </ErrorBoundary>
                )}
              {filePath &&
                (userId ? (
                  <div style={{ width: '100%' }}>
                    <ContentFileViewer
                      contentId={reply.id}
                      contentType="comment"
                      fileName={fileName}
                      filePath={filePath}
                      fileSize={Number(fileSize)}
                      thumbUrl={thumbUrl}
                      videoHeight="100%"
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginBottom: stringIsEmpty(reply.content)
                          ? fileType === 'audio'
                            ? '2rem'
                            : '1rem'
                          : 0
                      }}
                    />
                  </div>
                ) : (
                  <LoginToViewContent />
                ))}
              {isEditing ? (
                <EditTextArea
                  allowEmptyText={!!filePath}
                  style={{ marginBottom: '1rem' }}
                  contentId={reply.id}
                  contentType="comment"
                  text={reply.content}
                  onCancel={() =>
                    onSetIsEditing({
                      contentId: reply.id,
                      contentType: 'comment',
                      isEditing: false
                    })
                  }
                  onEditDone={handleEditDone}
                />
              ) : (
                <div>
                  <LongText className="comment__content">
                    {reply.content}
                  </LongText>
                  <div
                    style={{
                      marginTop: '1rem',
                      display: 'flex',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div className="comment__buttons">
                        <LikeButton
                          contentId={reply.id}
                          contentType="comment"
                          onClick={handleLikeClick}
                          likes={likes}
                          small
                        />
                        <Button
                          transparent
                          style={{ marginLeft: '1rem' }}
                          onClick={handleReplyClick}
                          disabled={loadingReplies}
                        >
                          <Icon icon="comment-alt" />
                          <span style={{ marginLeft: '0.7rem' }}>
                            {reply.numReplies > 1 ? 'Replies' : 'Reply'}
                            {loadingReplies ? (
                              <Icon
                                style={{ marginLeft: '0.7rem' }}
                                icon="spinner"
                                pulse
                              />
                            ) : reply.numReplies > 0 ? (
                              ` (${reply.numReplies})`
                            ) : (
                              ''
                            )}
                          </span>
                        </Button>
                        {userCanRewardThis && (
                          <Button
                            color="pink"
                            style={{ marginLeft: '1rem' }}
                            onClick={() =>
                              onSetXpRewardInterfaceShown({
                                contentId: reply.id,
                                contentType: 'comment',
                                shown: true
                              })
                            }
                            disabled={!!xpButtonDisabled}
                          >
                            <Icon icon="certificate" />
                            <span style={{ marginLeft: '0.7rem' }}>
                              {xpButtonDisabled || 'Reward'}
                            </span>
                          </Button>
                        )}
                      </div>
                      <small>
                        <Likers
                          className="comment__likes"
                          userId={userId}
                          likes={reply.likes}
                          onLinkClick={() => setUserListModalShown(true)}
                        />
                      </small>
                    </div>
                    <div>
                      <Button
                        color="brownOrange"
                        filled={isRecommendedByUser}
                        disabled={recommendationInterfaceShown}
                        onClick={() => setRecommendationInterfaceShown(true)}
                      >
                        <Icon icon="star" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <RecommendationStatus
              style={{ marginTop: '0.5rem' }}
              contentType="comment"
              recommendations={recommendations}
            />
            {recommendationInterfaceShown && (
              <RecommendationInterface
                style={{ marginTop: '0.5rem' }}
                contentId={reply.id}
                contentType="comment"
                onHide={() => setRecommendationInterfaceShown(false)}
                recommendations={recommendations}
                uploaderId={uploader.id}
              />
            )}
            {xpRewardInterfaceShown && (
              <XPRewardInterface
                innerRef={RewardInterfaceRef}
                rewardLevel={rewardLevel}
                rewards={rewards}
                contentType="comment"
                contentId={reply.id}
                onReward={() =>
                  setRecommendationInterfaceShown(
                    !isRecommendedByUser && twinkleCoins > 0
                  )
                }
                uploaderId={uploader.id}
              />
            )}
            <RewardStatus
              noMarginForEditButton
              rewardLevel={rewardLevel}
              onCommentEdit={onRewardCommentEdit}
              style={{
                fontSize: '1.5rem',
                marginTop: '0.5rem'
              }}
              rewards={rewards}
              uploaderName={uploader.username}
            />
            <ReplyInputArea
              innerRef={ReplyInputAreaRef}
              onSubmit={onSubmitReply}
              onSubmitWithAttachment={onSubmitWithAttachment}
              parent={parent}
              rootCommentId={reply.commentId}
              style={{
                marginTop: '0.5rem'
              }}
              targetCommentId={reply.id}
            />
          </section>
        </div>
        {userListModalShown && (
          <UserListModal
            onHide={() => setUserListModalShown(false)}
            title="People who liked this reply"
            users={reply.likes}
          />
        )}
        {confirmModalShown && (
          <ConfirmModal
            onHide={() => setConfirmModalShown(false)}
            title="Remove Reply"
            onConfirm={() => deleteReply(reply.id)}
          />
        )}
      </div>
    </ErrorBoundary>
  ) : null;

  async function handleEditDone(editedReply) {
    await editContent({
      editedComment: editedReply,
      contentId: reply.id,
      contentType: 'comment'
    });
    onEditDone({ editedComment: editedReply, commentId: reply.id });
    onSetIsEditing({
      contentId: reply.id,
      contentType: 'comment',
      isEditing: false
    });
  }

  function handleLikeClick({ likes, isUnlike }) {
    if (!xpButtonDisabled && userCanRewardThis && !isRewardedByUser) {
      onSetXpRewardInterfaceShown({
        contentId: reply.id,
        contentType: 'comment',
        shown: !isUnlike
      });
    } else {
      if (!isRecommendedByUser && !canReward) {
        setRecommendationInterfaceShown(!isUnlike);
      }
    }
    onLikeClick({ commentId: reply.id, likes });
  }

  async function handleReplyClick() {
    ReplyInputAreaRef.current.focus();
    setLoadingReplies(true);
    if (reply.numReplies > 0) {
      const { replies } = await loadReplies({
        commentId: reply.id
      });
      if (replies.length > 0) {
        onLoadRepliesOfReply({
          replies,
          commentId: reply.commentId,
          replyId: reply.id,
          contentId: parent.contentId,
          contentType: parent.contentType
        });
      }
    }
    setLoadingReplies(false);
  }
}

export default memo(Reply);
