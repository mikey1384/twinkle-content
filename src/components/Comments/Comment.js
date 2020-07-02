import PropTypes from 'prop-types';
import React, {
  memo,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import DropdownButton from 'components/Buttons/DropdownButton';
import Likers from 'components/Likers';
import UserListModal from 'components/Modals/UserListModal';
import Replies from './Replies';
import ReplyInputArea from './Replies/ReplyInputArea';
import EditTextArea from 'components/Texts/EditTextArea';
import UsernameText from 'components/Texts/UsernameText';
import ProfilePic from 'components/ProfilePic';
import Button from 'components/Button';
import LikeButton from 'components/Buttons/LikeButton';
import ConfirmModal from 'components/Modals/ConfirmModal';
import LongText from 'components/Texts/LongText';
import RewardStatus from 'components/RewardStatus';
import RecommendationInterface from 'components/RecommendationInterface';
import RecommendationStatus from 'components/RecommendationStatus';
import HiddenComment from 'components/HiddenComment';
import XPRewardInterface from 'components/XPRewardInterface';
import SubjectLink from './SubjectLink';
import Icon from 'components/Icon';
import { Link, useHistory } from 'react-router-dom';
import { commentContainer } from './Styles';
import { timeSince } from 'helpers/timeStampHelpers';
import { useContentState, useMyState } from 'helpers/hooks';
import { determineXpButtonDisabled, scrollElementToCenter } from 'helpers';
import { useAppContext, useContentContext } from 'contexts';
import LocalContext from './Context';

Comment.propTypes = {
  comment: PropTypes.shape({
    commentId: PropTypes.number,
    content: PropTypes.string.isRequired,
    deleted: PropTypes.bool,
    id: PropTypes.number.isRequired,
    likes: PropTypes.array,
    numReplies: PropTypes.number,
    profilePicId: PropTypes.number,
    recommendationInterfaceShown: PropTypes.bool,
    recommendations: PropTypes.array,
    replies: PropTypes.array,
    replyId: PropTypes.number,
    rewards: PropTypes.array,
    targetObj: PropTypes.object,
    targetUserName: PropTypes.string,
    targetUserId: PropTypes.number,
    timeStamp: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
      .isRequired,
    uploader: PropTypes.object.isRequired
  }).isRequired,
  innerRef: PropTypes.func,
  isPreview: PropTypes.bool,
  parent: PropTypes.object,
  rootContent: PropTypes.shape({
    contentType: PropTypes.string
  }),
  subject: PropTypes.object
};

function Comment({
  comment,
  innerRef,
  isPreview,
  parent,
  rootContent = {},
  subject,
  comment: {
    id: commentId,
    replies = [],
    likes = [],
    recommendations = [],
    rewards = [],
    uploader,
    numReplies
  }
}) {
  subject = subject || comment.targetObj?.subject || {};
  const history = useHistory();
  const {
    requestHelpers: { checkIfUserResponded, editContent, loadReplies }
  } = useAppContext();
  const { authLevel, canDelete, canEdit, canReward, userId } = useMyState();
  const {
    actions: {
      onChangeSpoilerStatus,
      onLoadReplies,
      onSetIsEditing,
      onSetXpRewardInterfaceShown
    }
  } = useContentContext();
  const {
    deleted,
    isEditing,
    xpRewardInterfaceShown: prevRewardInterfaceShown
  } = useContentState({
    contentType: 'comment',
    contentId: comment.id
  });
  const subjectState = useContentState({
    contentType: 'subject',
    contentId: subject.id
  });
  const {
    onAttachReward,
    onDelete,
    onEditDone,
    onLikeClick,
    onLoadMoreReplies,
    onReplySubmit,
    onRewardCommentEdit
  } = useContext(LocalContext);

  const [rewardInterfaceShown, setRewardInterfaceShown] = useState(
    prevRewardInterfaceShown
  );
  const [
    recommendationInterfaceShown,
    setRecommendationInterfaceShown
  ] = useState(false);
  const rewardInterfaceShownRef = useRef(prevRewardInterfaceShown);
  const [userListModalShown, setUserListModalShown] = useState(false);
  const [confirmModalShown, setConfirmModalShown] = useState(false);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const prevReplies = useRef(replies);
  const [replying, setReplying] = useState(false);
  const ReplyInputAreaRef = useRef(null);
  const ReplyRefs = {};
  const mounted = useRef(true);
  const RewardInterfaceRef = useRef(null);
  const isRecommendedByUser = useMemo(() => {
    return (
      recommendations.filter((recommendation) => recommendation.id === userId)
        .length > 0
    );
  }, [recommendations, userId]);
  const rewardLevel = useMemo(() => {
    if (isPreview) return 0;
    if (parent.contentType === 'subject' && parent.rewardLevel > 0) {
      return parent.rewardLevel;
    }
    if (rootContent.contentType === 'subject' && rootContent.rewardLevel > 0) {
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
    if (
      rootContent.contentType === 'video' ||
      rootContent.contentType === 'url'
    ) {
      if (subject?.rewardLevel) {
        return subject?.rewardLevel;
      }
      if (rootContent.rewardLevel > 0) {
        return 1;
      }
    }
    return 0;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isPreview,
    parent.contentType,
    parent.rewardLevel,
    rootContent.contentType,
    rootContent.rewardLevel,
    subject
  ]);

  useEffect(() => {
    handleRewardInterfaceShown(prevRewardInterfaceShown);
  }, [prevRewardInterfaceShown]);

  useEffect(() => {
    if (!isPreview) {
      if (replying && replies?.length > prevReplies.current?.length) {
        setReplying(false);
        scrollElementToCenter(ReplyRefs[replies[replies.length - 1].id]);
      }
      prevReplies.current = replies;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [replies]);

  const userIsUploader = useMemo(() => uploader.id === userId, [
    uploader.id,
    userId
  ]);
  const userIsHigherAuth = useMemo(() => authLevel > uploader.authLevel, [
    authLevel,
    uploader.authLevel
  ]);
  const editButtonShown = useMemo(() => {
    const isForSecretSubject =
      (rootContent?.secretAnswer &&
        !(
          rootContent?.uploader?.id === userId ||
          authLevel > rootContent?.uploader?.authLevel
        )) ||
      (parent?.secretAnswer &&
        !(
          parent?.uploader?.id === userId ||
          authLevel > parent?.uploader?.authLevel
        )) ||
      (subject?.secretAnswer &&
        !(
          subject?.uploader?.id === userId ||
          authLevel > subject?.uploader?.authLevel
        ));
    const userCanEditThis = (canEdit || canDelete) && userIsHigherAuth;
    return (userIsUploader && !isForSecretSubject) || userCanEditThis;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    authLevel,
    canDelete,
    canEdit,
    parent,
    rootContent,
    subject,
    userId,
    userIsHigherAuth,
    userIsUploader
  ]);
  const editMenuItems = useMemo(() => {
    const items = [];
    if (userIsUploader || canEdit) {
      items.push({
        label: 'Edit',
        onClick: () =>
          onSetIsEditing({
            contentId: comment.id,
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
  }, [canDelete, canEdit, comment.id, userIsUploader]);
  useEffect(() => {
    handleRewardInterfaceShown(
      rewardInterfaceShown && userIsHigherAuth && canReward && !userIsUploader
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const isCommentForContentSubject = useMemo(
    () => parent.contentType !== 'subject' && !parent.subjectId && subject,
    [parent.contentType, parent.subjectId, subject]
  );

  const isHidden = useMemo(() => {
    const hasSecretAnswer = subject?.secretAnswer;
    const secretShown =
      subjectState.secretShown || subject?.uploader?.id === userId;
    return hasSecretAnswer && !secretShown;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subject, subjectState.secretShown, userId]);

  const xpButtonDisabled = useMemo(() => {
    if (isPreview) return true;
    return determineXpButtonDisabled({
      rewardLevel,
      myId: userId,
      xpRewardInterfaceShown: rewardInterfaceShown,
      rewards
    });
  }, [isPreview, rewardInterfaceShown, rewardLevel, rewards, userId]);

  useEffect(() => {
    mounted.current = true;
    if (mounted.current) {
      if (userId && subject && !subjectState.spoilerStatusChecked) {
        checkSecretShown();
      }
      if (!userId) {
        onChangeSpoilerStatus({
          shown: false,
          subjectId: subject?.id,
          checked: false
        });
      }
    }

    async function checkSecretShown() {
      if (isHidden) {
        const { responded } = await checkIfUserResponded(subject?.id);
        if (mounted.current) {
          onChangeSpoilerStatus({
            shown: responded,
            subjectId: subject?.id,
            checked: true
          });
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  useEffect(() => {
    return function saveStateBeforeUnmount() {
      mounted.current = false;
      if (rewardInterfaceShownRef.current) {
        onSetXpRewardInterfaceShown({
          contentId: comment.id,
          contentType: 'comment',
          shown: true
        });
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return !deleted && !comment.deleted ? (
    <>
      <div
        style={isPreview ? { cursor: 'pointer' } : {}}
        className={commentContainer}
        ref={innerRef}
      >
        <div className="content-wrapper">
          <aside>
            <ProfilePic
              style={{ height: '5rem', width: '5rem' }}
              userId={uploader?.id}
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
                <Link to={`/comments/${comment.id}`}>
                  {parent.contentType === 'user' ? 'messag' : 'comment'}
                  ed {timeSince(comment.timeStamp)}
                </Link>
              </small>
            </div>
            <div>
              {comment.targetUserId &&
                !!comment.replyId &&
                comment.replyId !== parent.contentId && (
                  <span className="to">
                    to:{' '}
                    <UsernameText
                      user={{
                        username: comment.targetUserName,
                        id: comment.targetUserId
                      }}
                    />
                  </span>
                )}
              {isEditing ? (
                <EditTextArea
                  contentType="comment"
                  contentId={comment.id}
                  text={comment.content}
                  onCancel={() =>
                    onSetIsEditing({
                      contentId: comment.id,
                      contentType: 'comment',
                      isEditing: false
                    })
                  }
                  onEditDone={handleEditDone}
                />
              ) : (
                <div>
                  {isCommentForContentSubject && (
                    <SubjectLink subject={subject} />
                  )}
                  {isHidden ? (
                    <HiddenComment
                      onClick={() => history.push(`/subjects/${subject?.id}`)}
                    />
                  ) : (
                    <LongText className="comment__content">
                      {comment.content}
                    </LongText>
                  )}
                  {!isPreview && !isHidden && (
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div>
                        <div className="comment__buttons">
                          <LikeButton
                            contentType="comment"
                            contentId={comment.id}
                            onClick={handleLikeClick}
                            likes={likes}
                          />
                          <Button
                            disabled={loadingReplies}
                            transparent
                            style={{ marginLeft: '1rem' }}
                            onClick={handleReplyButtonClick}
                          >
                            <Icon icon="comment-alt" />
                            <span style={{ marginLeft: '1rem' }}>
                              {numReplies > 1 &&
                              parent.contentType === 'comment'
                                ? 'Replies'
                                : 'Reply'}{' '}
                              {numReplies > 0 &&
                              parent.contentType === 'comment'
                                ? ` (${numReplies})`
                                : ''}
                            </span>
                          </Button>
                          {canReward && userIsHigherAuth && !userIsUploader && (
                            <Button
                              color="pink"
                              style={{ marginLeft: '0.7rem' }}
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
                        <Likers
                          className="comment__likes"
                          userId={userId}
                          likes={comment.likes}
                          onLinkClick={() => setUserListModalShown(true)}
                        />
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
                  )}
                </div>
              )}
            </div>
            {!isPreview && (
              <RecommendationStatus
                style={{ marginTop: likes.length > 0 ? '0.5rem' : '1rem' }}
                contentType="comment"
                recommendations={recommendations}
              />
            )}
            {!isPreview && recommendationInterfaceShown && (
              <RecommendationInterface
                style={{ marginTop: likes.length > 0 ? '0.5rem' : '1rem' }}
                contentId={commentId}
                contentType="comment"
                onHide={() => setRecommendationInterfaceShown(false)}
                isRecommendedByUser={isRecommendedByUser}
              />
            )}
            {!isPreview && rewardInterfaceShown && (
              <XPRewardInterface
                innerRef={RewardInterfaceRef}
                rewardLevel={rewardLevel}
                rewards={rewards}
                contentType="comment"
                contentId={comment.id}
                uploaderId={uploader.id}
                onRewardSubmit={(data) => {
                  handleRewardInterfaceShown(false);
                  onSetXpRewardInterfaceShown({
                    contentId: comment.id,
                    contentType: 'comment',
                    shown: false
                  });
                  onAttachReward({
                    data,
                    contentId: comment.id,
                    contentType: 'comment'
                  });
                }}
              />
            )}
            {!isPreview && (
              <RewardStatus
                rewardLevel={rewardLevel}
                noMarginForEditButton
                onCommentEdit={onRewardCommentEdit}
                style={{
                  fontSize: '1.5rem',
                  marginTop: comment.likes?.length > 0 ? '0.5rem' : '1rem'
                }}
                rewards={rewards}
                uploaderName={uploader.username}
              />
            )}
            {!isPreview && !isHidden && (
              <>
                <ReplyInputArea
                  innerRef={ReplyInputAreaRef}
                  numReplies={replies?.length}
                  onSubmit={submitReply}
                  parent={parent}
                  rootCommentId={comment.commentId}
                  style={{
                    marginTop:
                      rewards?.length > 0 || comment.likes?.length > 0
                        ? '0.5rem'
                        : '1rem'
                  }}
                  targetCommentId={comment.id}
                />
                <Replies
                  subject={subject || {}}
                  userId={userId}
                  replies={replies}
                  comment={comment}
                  parent={parent}
                  rootContent={rootContent}
                  onLoadMoreReplies={onLoadMoreReplies}
                  onReplySubmit={onReplySubmit}
                  ReplyRefs={ReplyRefs}
                />
              </>
            )}
          </section>
        </div>
        {userListModalShown && (
          <UserListModal
            onHide={() => setUserListModalShown(false)}
            title="People who liked this comment"
            users={comment.likes}
          />
        )}
      </div>
      {confirmModalShown && (
        <ConfirmModal
          onHide={() => setConfirmModalShown(false)}
          title="Remove Comment"
          onConfirm={() => onDelete(comment.id)}
        />
      )}
    </>
  ) : null;

  async function handleEditDone(editedComment) {
    await editContent({
      editedComment,
      contentId: comment.id,
      contentType: 'comment'
    });
    onEditDone({ editedComment, commentId: comment.id });
    onSetIsEditing({
      contentId: comment.id,
      contentType: 'comment',
      isEditing: false
    });
  }

  function handleLikeClick({ likes }) {
    onLikeClick({ commentId: comment.id, likes });
  }

  async function handleReplyButtonClick() {
    if (numReplies > 0 && parent.contentType === 'comment') {
      setLoadingReplies(true);
      const { loadMoreButton, replies } = await loadReplies({ commentId });
      onLoadReplies({
        commentId,
        loadMoreButton,
        replies,
        contentType: 'comment',
        contentId: parent.contentId
      });
      setLoadingReplies(false);
    }
    ReplyInputAreaRef.current.focus();
  }

  function handleRewardInterfaceShown(shown) {
    setRewardInterfaceShown(shown);
    rewardInterfaceShownRef.current = shown;
  }

  function submitReply(reply) {
    setReplying(true);
    onReplySubmit(reply);
  }
}

export default memo(Comment);
