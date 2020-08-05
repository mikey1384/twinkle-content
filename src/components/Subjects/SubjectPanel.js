import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import UsernameText from 'components/Texts/UsernameText';
import Comments from 'components/Comments';
import DropdownButton from 'components/Buttons/DropdownButton';
import Textarea from 'components/Texts/Textarea';
import LongText from 'components/Texts/LongText';
import ConfirmModal from 'components/Modals/ConfirmModal';
import Icon from 'components/Icon';
import Input from 'components/Texts/Input';
import RewardLevelBar from 'components/RewardLevelBar';
import Link from 'components/Link';
import SecretAnswer from 'components/SecretAnswer';
import StarButton from 'components/Buttons/StarButton';
import LocalContext from './Context';
import RewardStatus from 'components/RewardStatus';
import XPRewardInterface from 'components/XPRewardInterface';
import RecommendationStatus from 'components/RecommendationStatus';
import RecommendationInterface from 'components/RecommendationInterface';
import { css } from 'emotion';
import { Color, mobileMaxWidth } from 'constants/css';
import { descriptionLengthForExtraRewardLevel } from 'constants/defaultValues';
import { stringIsEmpty, addEmoji, finalizeEmoji } from 'helpers/stringHelpers';
import { determineXpButtonDisabled } from 'helpers';
import { timeSince } from 'helpers/timeStampHelpers';
import { useContentState, useMyState } from 'helpers/hooks';
import { useAppContext, useContentContext } from 'contexts';

SubjectPanel.propTypes = {
  description: PropTypes.string,
  rewardLevel: PropTypes.number,
  loadMoreCommentsButton: PropTypes.bool.isRequired,
  numComments: PropTypes.string,
  rootRewardLevel: PropTypes.number,
  secretAnswer: PropTypes.string,
  timeStamp: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  title: PropTypes.string.isRequired,
  userId: PropTypes.number,
  username: PropTypes.string.isRequired,
  uploaderAuthLevel: PropTypes.number.isRequired,
  rootType: PropTypes.string.isRequired,
  rootId: PropTypes.number.isRequired,
  subjectId: PropTypes.number.isRequired
};

export default function SubjectPanel({
  rootId,
  rootType,
  description,
  title,
  rewardLevel,
  uploaderAuthLevel,
  username,
  userId,
  timeStamp,
  numComments,
  loadMoreCommentsButton,
  rootRewardLevel,
  secretAnswer,
  subjectId
}) {
  const {
    requestHelpers: { deleteSubject, editSubject, loadComments }
  } = useAppContext();
  const {
    actions: {
      onChangeSpoilerStatus,
      onEditRewardComment,
      onRecommendSubject,
      onSetXpRewardInterfaceShown
    }
  } = useContentContext();
  const {
    authLevel,
    canDelete,
    canEdit,
    canEditRewardLevel,
    canReward,
    twinkleCoins,
    userId: myId
  } = useMyState();
  const {
    editRewardComment,
    onDelete,
    onEditDone,
    onLikeClick,
    onLoadMoreComments,
    onLoadMoreReplies,
    onLoadRepliesOfReply,
    onSubjectEditDone,
    onSubjectDelete,
    onLoadSubjectComments,
    onSetRewardLevel,
    onUploadComment,
    onUploadReply
  } = useContext(LocalContext);

  const {
    comments,
    deleted,
    secretShown,
    fileName,
    filePath,
    recommendations,
    rewards,
    xpRewardInterfaceShown
  } = useContentState({
    contentType: 'subject',
    contentId: subjectId
  });
  const [expanded, setExpanded] = useState(false);
  const [onEdit, setOnEdit] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);
  const [confirmModalShown, setConfirmModalShown] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedDescription, setEditedDescription] = useState(description || '');
  const [editedSecretAnswer, setEditedSecretAnswer] = useState(
    secretAnswer || ''
  );
  const [editDoneButtonDisabled, setEditDoneButtonDisabled] = useState(true);
  const [
    recommendationInterfaceShown,
    setRecommendationInterfaceShown
  ] = useState(false);
  const userIsUploader = myId === userId;

  const editButtonShown = useMemo(() => {
    const userHasHigherAuthLevel = authLevel > uploaderAuthLevel;
    const userCanEditThis = (canEdit || canDelete) && userHasHigherAuthLevel;
    return userIsUploader || userCanEditThis;
  }, [authLevel, canDelete, canEdit, uploaderAuthLevel, userIsUploader]);
  const secretHidden = useMemo(
    () => !!secretAnswer && !(secretShown || userIsUploader),
    [secretAnswer, secretShown, userIsUploader]
  );
  const rewardButtonShown = useMemo(() => {
    return (
      !onEdit && canReward && !userIsUploader && authLevel > uploaderAuthLevel
    );
  }, [authLevel, canReward, onEdit, uploaderAuthLevel, userIsUploader]);
  const finalRewardLevel = useMemo(() => {
    return description?.length > descriptionLengthForExtraRewardLevel ? 5 : 0;
  }, [description]);

  const isRecommendedByUser = useMemo(() => {
    return (
      recommendations.filter(
        (recommendation) => recommendation.userId === userId
      ).length > 0
    );
  }, [recommendations, userId]);

  useEffect(() => {
    const titleIsEmpty = stringIsEmpty(editedTitle);
    const titleChanged = editedTitle !== title;
    const descriptionChanged = editedDescription !== description;
    const secretAnswerChanged = editedSecretAnswer !== secretAnswer;
    const editDoneButtonDisabled =
      titleIsEmpty ||
      (!titleChanged && !descriptionChanged && !secretAnswerChanged);
    setEditDoneButtonDisabled(editDoneButtonDisabled);
  }, [
    editedTitle,
    editedDescription,
    editedSecretAnswer,
    title,
    description,
    secretAnswer
  ]);

  const CommentsRef = useRef(null);
  const RewardInterfaceRef = useRef(null);

  return !deleted ? (
    <div
      style={{
        background: '#fff',
        border: `1px solid ${Color.borderGray()}`,
        marginTop: '1rem',
        fontSize: '1.5rem'
      }}
    >
      {rewardLevel > 0 && <RewardLevelBar rewardLevel={rewardLevel} />}
      <div style={{ padding: '1rem' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          {!onEdit && (
            <Link
              to={`/subjects/${subjectId}`}
              style={{
                fontSize: '2.5rem',
                color: Color.green(),
                fontWeight: 'bold'
              }}
            >
              {title}
            </Link>
          )}
          <div style={{ display: 'flex' }}>
            {canEditRewardLevel && !onEdit && (
              <StarButton
                contentId={subjectId}
                contentType="subject"
                rewardLevel={rewardLevel}
                onSetRewardLevel={onSetRewardLevel}
              />
            )}
            <div>
              {editButtonShown && !onEdit && (
                <DropdownButton
                  skeuomorphic
                  style={{ marginLeft: '1rem' }}
                  color="darkerGray"
                  direction="left"
                  menuProps={renderMenuProps()}
                />
              )}
            </div>
          </div>
        </div>
        {!onEdit && !!description && (
          <LongText style={{ padding: '1rem 0' }}>{description}</LongText>
        )}
        {secretAnswer && !onEdit && (
          <SecretAnswer
            style={{ marginTop: '1rem' }}
            answer={secretAnswer}
            subjectId={subjectId}
            onClick={handleExpand}
            uploaderId={userId}
            parent={{
              contentType: 'subject',
              contentId: subjectId
            }}
          />
        )}
        {onEdit && (
          <form onSubmit={(event) => event.preventDefault()}>
            <Input
              autoFocus
              placeholder="Enter Title..."
              value={editedTitle}
              onChange={(text) => {
                setEditedTitle(text);
              }}
              onKeyUp={(event) => setEditedTitle(addEmoji(event.target.value))}
            />
          </form>
        )}
        {onEdit && (
          <div>
            <Textarea
              placeholder="Enter Description (Optional)"
              style={{ marginTop: '1rem' }}
              minRows={5}
              value={editedDescription}
              onChange={(event) => {
                setEditedDescription(event.target.value);
              }}
            />
            <div style={{ marginTop: '1rem' }}>
              <span style={{ fontSize: '1.7rem', fontWeight: 'bold' }}>
                Secret Message
              </span>
              <Textarea
                style={{ marginTop: '0.7rem' }}
                placeholder="Enter Secret Message (Optional)"
                minRows={5}
                value={editedSecretAnswer}
                onChange={(event) => {
                  setEditedSecretAnswer(event.target.value);
                }}
              />
            </div>
            <div
              style={{
                marginTop: '1rem',
                display: 'flex',
                justifyContent: 'center'
              }}
            >
              <Button
                transparent
                style={{
                  fontSize: '1.7rem',
                  marginRight: '1rem'
                }}
                onClick={() => {
                  setOnEdit(false);
                  setEditedTitle(title);
                  setEditedDescription(description);
                  setEditedSecretAnswer(secretAnswer);
                }}
              >
                Cancel
              </Button>
              <Button
                color="blue"
                style={{
                  fontSize: '1.8rem'
                }}
                onClick={handleEditDone}
                disabled={editDoneButtonDisabled}
              >
                Done
              </Button>
            </div>
          </div>
        )}
        {!onEdit && (
          <div style={{ marginTop: '1rem' }}>
            {!secretHidden && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  minHeight: '8rem'
                }}
              >
                <Button
                  skeuomorphic
                  color="black"
                  style={{ fontSize: '2rem' }}
                  onClick={handleExpand}
                >
                  <Icon icon="comment-alt" />
                  <span style={{ marginLeft: '1rem' }}>
                    Comment{!expanded && numComments > 1 ? 's' : ''}
                    {!expanded &&
                    numComments &&
                    numComments > 0 &&
                    comments.length === 0
                      ? ` (${numComments})`
                      : ''}
                  </span>
                </Button>
                {rewardButtonShown && (
                  <Button
                    skeuomorphic
                    color="pink"
                    style={{ fontSize: '2rem', marginLeft: '1rem' }}
                    disabled={determineXpButtonDisabled({
                      rewardLevel: finalRewardLevel,
                      myId,
                      xpRewardInterfaceShown,
                      rewards
                    })}
                    onClick={() =>
                      onSetXpRewardInterfaceShown({
                        contentType: 'subject',
                        contentId: subjectId,
                        shown: true
                      })
                    }
                  >
                    <Icon icon="certificate" />
                    <span style={{ marginLeft: '0.7rem' }}>
                      {determineXpButtonDisabled({
                        rewardLevel: finalRewardLevel,
                        myId,
                        xpRewardInterfaceShown,
                        rewards
                      }) || 'Reward'}
                    </span>
                  </Button>
                )}
                <Button
                  color="brownOrange"
                  style={{ fontSize: '2rem', marginLeft: '1rem' }}
                  skeuomorphic
                  filled={isRecommendedByUser}
                  disabled={recommendationInterfaceShown}
                  onClick={() => setRecommendationInterfaceShown(true)}
                >
                  <Icon icon="star" />
                </Button>
              </div>
            )}
            <RecommendationStatus
              style={{
                marginBottom: '1rem',
                marginLeft: '-1rem',
                marginRight: '-1rem'
              }}
              contentType="subject"
              recommendations={recommendations}
            />
            {recommendationInterfaceShown && (
              <RecommendationInterface
                contentId={subjectId}
                contentType="subject"
                style={{
                  marginLeft: '-1rem',
                  marginRight: '-1rem',
                  fontSize: '1.7rem'
                }}
                onRecommend={(recommendations) =>
                  onRecommendSubject({ subjectId, recommendations })
                }
                onHide={() => setRecommendationInterfaceShown(false)}
                recommendations={recommendations}
                uploaderId={userId}
              />
            )}
            {xpRewardInterfaceShown && (
              <XPRewardInterface
                innerRef={RewardInterfaceRef}
                contentType="subject"
                contentId={subjectId}
                onReward={() =>
                  setRecommendationInterfaceShown(
                    !isRecommendedByUser && twinkleCoins > 0
                  )
                }
                rewardLevel={finalRewardLevel}
                uploaderId={userId}
                rewards={rewards}
              />
            )}
            <RewardStatus
              contentType="subject"
              rewardLevel={finalRewardLevel}
              onCommentEdit={onEditRewardComment}
              rewards={rewards}
              className={css`
                margin-left: CALC(-1rem - 1px);
                margin-right: CALC(-1rem - 1px);
                @media (max-width: ${mobileMaxWidth}) {
                  margin-left: 0px;
                  margin-right: 0px;
                }
              `}
            />
            <Comments
              inputAreaInnerRef={CommentsRef}
              isLoading={loadingComments}
              numInputRows={3}
              commentsLoadLimit={10}
              commentsHidden={secretHidden}
              commentsShown
              inputTypeLabel={'comment'}
              comments={comments}
              loadMoreButton={loadMoreCommentsButton}
              userId={myId}
              onCommentSubmit={handleCommentSubmit}
              onDelete={onDelete}
              onEditDone={onEditDone}
              onLikeClick={onLikeClick}
              onLoadMoreComments={loadMoreComments}
              onLoadMoreReplies={onLoadMoreReplies}
              onLoadRepliesOfReply={onLoadRepliesOfReply}
              onReplySubmit={onUploadReply}
              onRewardCommentEdit={editRewardComment}
              parent={{
                contentId: rootId,
                contentType: rootType,
                rewardLevel: rootRewardLevel,
                secretAnswer,
                uploader: {
                  id: userId,
                  authLevel: uploaderAuthLevel
                }
              }}
              rootContent={{
                contentType: rootType
              }}
              subject={{
                id: subjectId,
                rewardLevel,
                secretAnswer,
                uploader: {
                  id: userId,
                  authLevel: uploaderAuthLevel
                }
              }}
            />
          </div>
        )}
        <div style={{ marginTop: '1rem' }}>
          By{' '}
          <b>
            <UsernameText
              user={{
                username,
                id: userId
              }}
            />
          </b>{' '}
          &nbsp;|&nbsp; Published {timeSince(timeStamp)}
        </div>
      </div>
      {confirmModalShown && (
        <ConfirmModal
          onHide={() => setConfirmModalShown(false)}
          title="Remove Subject"
          onConfirm={deleteThis}
        />
      )}
    </div>
  ) : null;

  async function deleteThis() {
    try {
      await deleteSubject({ fileName, filePath, subjectId });
      setConfirmModalShown(false);
      onSubjectDelete(subjectId);
    } catch (error) {
      return console.error(error);
    }
  }

  function renderMenuProps() {
    const menuProps = [
      {
        label: 'Edit',
        onClick: () => setOnEdit(true)
      },
      {
        label: 'Remove',
        onClick: () => setConfirmModalShown(true)
      }
    ];
    return menuProps;
  }

  async function handleCommentSubmit(params) {
    onChangeSpoilerStatus({
      shown: true,
      subjectId,
      checked: true
    });
    if (secretHidden) {
      return handleExpand(true);
    }
    onUploadComment({
      ...params,
      subjectId,
      contentId: rootId,
      contentType: rootType
    });
  }

  async function handleExpand(revealingSecret) {
    setExpanded(true);
    try {
      setLoadingComments(true);
      if (!secretHidden || revealingSecret) {
        const data = await loadComments({
          contentType: 'subject',
          contentId: subjectId,
          limit: 10
        });
        onLoadSubjectComments({
          ...data,
          subjectId,
          contentType: rootType,
          contentId: rootId
        });
      }
      setLoadingComments(false);
      CommentsRef.current.focus();
    } catch (error) {
      console.error(error.response || error);
    }
  }

  async function handleEditDone() {
    const editedSubject = await editSubject({
      subjectId,
      editedTitle: finalizeEmoji(editedTitle),
      editedDescription: finalizeEmoji(editedDescription),
      editedSecretAnswer: finalizeEmoji(editedSecretAnswer)
    });
    onSubjectEditDone({ editedSubject, subjectId });
    setOnEdit(false);
    setEditDoneButtonDisabled(true);
  }

  function loadMoreComments(data) {
    onLoadMoreComments({ data, subjectId });
  }
}
