import React, {
  memo,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
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
import FileViewer from 'components/FileViewer';
import { commentContainer } from '../Styles';
import { Link } from 'react-router-dom';
import { determineUserCanRewardThis, determineXpButtonDisabled } from 'helpers';
import { useContentState, useMyState } from 'helpers/hooks';
import { timeSince } from 'helpers/timeStampHelpers';
import { useAppContext, useContentContext } from 'contexts';
import { getFileInfoFromFileName } from 'helpers/stringHelpers';

Reply.propTypes = {
  comment: PropTypes.shape({
    id: PropTypes.number.isRequired
  }),
  innerRef: PropTypes.func,
  deleteReply: PropTypes.func.isRequired,
  onLoadRepliesOfReply: PropTypes.func,
  onSubmitWithAttachment: PropTypes.func.isRequired,
  parent: PropTypes.object.isRequired,
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
    profilePicId: PropTypes.number,
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
  onSubmitWithAttachment,
  parent,
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
  const { authLevel, canDelete, canEdit, canReward, userId } = useMyState();
  const {
    actions: { onSetIsEditing, onSetXpRewardInterfaceShown }
  } = useContentContext();
  const {
    deleted,
    isEditing,
    thumbUrl,
    xpRewardInterfaceShown: prevRewardInterfaceShown
  } = useContentState({
    contentType: 'comment',
    contentId: reply.id
  });
  const {
    onAttachReward,
    onEditDone,
    onLikeClick,
    onRewardCommentEdit
  } = useContext(LocalContext);
  const [rewardInterfaceShown, setRewardInterfaceShown] = useState(
    prevRewardInterfaceShown
  );
  const { fileType } = getFileInfoFromFileName(fileName);
  const rewardInterfaceShownRef = useRef(prevRewardInterfaceShown);
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
  const userIsHigherAuth = authLevel > uploader.authLevel;
  const isRecommendedByUser = useMemo(() => {
    return (
      recommendations.filter((recommendation) => recommendation.id === userId)
        .length > 0
    );
  }, [recommendations, userId]);
  const editButtonShown = useMemo(() => {
    const userCanEditThis = (canEdit || canDelete) && userIsHigherAuth;
    return userIsUploader || userCanEditThis;
  }, [canDelete, canEdit, userIsHigherAuth, userIsUploader]);
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
    rootContent?.rewardLevel,
    subject?.rewardLevel
  ]);
  const xpButtonDisabled = useMemo(
    () =>
      determineXpButtonDisabled({
        myId: userId,
        rewardLevel,
        xpRewardInterfaceShown: rewardInterfaceShown,
        rewards
      }),
    [rewardLevel, rewards, userId, rewardInterfaceShown]
  );

  useEffect(() => {
    handleRewardInterfaceShown(
      rewardInterfaceShown && userIsHigherAuth && canReward && !userIsUploader
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const editMenuItems = useMemo(() => {
    const items = [];
    if (userIsUploader || canEdit) {
      items.push({
        label: 'Edit',
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
        label: 'Remove',
        onClick: () => setConfirmModalShown(true)
      });
    }
    return items;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canDelete, canEdit, reply.id, userIsUploader]);

  useEffect(() => {
    return function saveStateBeforeUnmount() {
      onSetXpRewardInterfaceShown({
        contentType: 'comment',
        contentId: reply.id,
        shown: rewardInterfaceShownRef.current
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return !deleted && !reply.deleted ? (
    <ErrorBoundary>
      <div className={commentContainer} ref={innerRef}>
        <div className="content-wrapper">
          <aside>
            <ProfilePic
              style={{ height: '5rem', width: '5rem' }}
              userId={uploader.id}
              profilePicId={uploader.profilePicId}
            />
          </aside>
          {editButtonShown && !isEditing && (
            <div className="dropdown-wrapper">
              <DropdownButton
                skeuomorphic
                color="darkerGray"
                direction="left"
                opacity={0.8}
                menuProps={editMenuItems}
              />
            </div>
          )}
          <section>
            <div>
              <UsernameText className="username" user={uploader} />{' '}
              <small className="timestamp">
                <Link to={`/comments/${reply.id}`}>
                  replied {timeSince(reply.timeStamp)}
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
              {isEditing ? (
                <EditTextArea
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
                  {filePath &&
                    (userId ? (
                      <div style={{ width: '100%' }}>
                        <FileViewer
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
                            ...(fileType === 'audio'
                              ? {
                                  paddingBottom: '2rem'
                                }
                              : {}),
                            marginBottom: rewardLevel ? '1rem' : 0
                          }}
                        />
                      </div>
                    ) : (
                      <LoginToViewContent />
                    ))}
                  <div
                    style={{
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
                            {reply.numReplies > 0
                              ? ` (${reply.numReplies})`
                              : ''}
                          </span>
                        </Button>
                        {userCanRewardThis && (
                          <Button
                            color="pink"
                            style={{ marginLeft: '1rem' }}
                            onClick={() => handleRewardInterfaceShown(true)}
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
              style={{ marginTop: likes.length > 0 ? '0.5rem' : '1rem' }}
              contentType="comment"
              recommendations={recommendations}
            />
            {recommendationInterfaceShown && (
              <RecommendationInterface
                style={{ marginTop: likes.length > 0 ? '0.5rem' : '1rem' }}
                contentId={reply.id}
                contentType="comment"
                onHide={() => setRecommendationInterfaceShown(false)}
                isRecommendedByUser={isRecommendedByUser}
              />
            )}
            {rewardInterfaceShown && (
              <XPRewardInterface
                innerRef={RewardInterfaceRef}
                rewardLevel={rewardLevel}
                rewards={rewards}
                contentType="comment"
                contentId={reply.id}
                uploaderId={uploader.id}
                onRewardSubmit={(data) => {
                  handleRewardInterfaceShown(false);
                  onSetXpRewardInterfaceShown({
                    contentId: reply.id,
                    contentType: 'comment',
                    shown: false
                  });
                  onAttachReward({
                    data,
                    contentId: reply.id,
                    contentType: 'comment'
                  });
                }}
              />
            )}
            <RewardStatus
              noMarginForEditButton
              rewardLevel={rewardLevel}
              onCommentEdit={onRewardCommentEdit}
              style={{
                fontSize: '1.5rem',
                marginTop: reply.likes.length > 0 ? '0.5rem' : '1rem'
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
                marginTop:
                  rewards.length > 0 || reply.likes.length > 0
                    ? '0.5rem'
                    : '1rem'
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
    if (!xpButtonDisabled && userCanRewardThis) {
      onSetXpRewardInterfaceShown({
        contentId: comment.id,
        contentType: 'comment',
        shown: !isUnlike
      });
    } else {
      if (!isRecommendedByUser && authLevel === 0) {
        setRecommendationInterfaceShown(!isUnlike);
      }
    }
    onLikeClick({ commentId: reply.id, likes });
  }

  function handleRewardInterfaceShown(shown) {
    setRewardInterfaceShown(shown);
    rewardInterfaceShownRef.current = shown;
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
