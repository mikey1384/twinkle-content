import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import DropdownButton from 'components/Buttons/DropdownButton';
import Button from 'components/Button';
import Icon from 'components/Icon';
import XPRewardInterface from 'components/XPRewardInterface';
import AlreadyPosted from 'components/AlreadyPosted';
import BasicInfos from './BasicInfos';
import SideButtons from './SideButtons';
import Description from './Description';
import RecommendationInterface from 'components/RecommendationInterface';
import RecommendationStatus from 'components/RecommendationStatus';
import TagStatus from 'components/TagStatus';
import {
  isMobile,
  determineUserCanRewardThis,
  determineXpButtonDisabled,
  textIsOverflown
} from 'helpers';
import { Color, mobileMaxWidth } from 'constants/css';
import {
  addCommasToNumber,
  addEmoji,
  exceedsCharLimit,
  stringIsEmpty,
  finalizeEmoji,
  isValidYoutubeUrl
} from 'helpers/stringHelpers';
import { useContentState, useMyState } from 'helpers/hooks';
import {
  useContentContext,
  useExploreContext,
  useInputContext
} from 'contexts';
import { css } from '@emotion/css';

Details.propTypes = {
  addTags: PropTypes.func.isRequired,
  changeByUserStatus: PropTypes.func.isRequired,
  byUser: PropTypes.bool,
  changingPage: PropTypes.bool,
  content: PropTypes.string.isRequired,
  description: PropTypes.string,
  rewardLevel: PropTypes.number,
  likes: PropTypes.array.isRequired,
  onDelete: PropTypes.func.isRequired,
  onEditFinish: PropTypes.func.isRequired,
  onSetRewardLevel: PropTypes.func.isRequired,
  recommendations: PropTypes.array.isRequired,
  tags: PropTypes.array,
  rewards: PropTypes.array,
  timeStamp: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  title: PropTypes.string.isRequired,
  uploader: PropTypes.object.isRequired,
  userId: PropTypes.number,
  videoId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  videoViews: PropTypes.number.isRequired
};

export default function Details({
  addTags,
  byUser,
  changeByUserStatus,
  changingPage,
  content,
  rewardLevel,
  userId,
  uploader,
  title,
  description,
  likes,
  recommendations,
  onDelete,
  onEditFinish,
  tags = [],
  onSetRewardLevel,
  rewards,
  timeStamp,
  videoId,
  videoViews
}) {
  const {
    authLevel,
    canDelete,
    canEdit,
    canEditPlaylists,
    canReward,
    twinkleCoins
  } = useMyState();
  const {
    actions: { onSetIsEditing, onSetXpRewardInterfaceShown }
  } = useContentContext();
  const {
    state: inputState,
    actions: { onSetEditForm }
  } = useInputContext();
  const {
    actions: { onLikeVideo }
  } = useExploreContext();
  const { isEditing, xpRewardInterfaceShown } = useContentState({
    contentType: 'video',
    contentId: videoId
  });
  const [
    recommendationInterfaceShown,
    setRecommendationInterfaceShown
  ] = useState(false);
  const [titleHovered, setTitleHovered] = useState(false);
  const TitleRef = useRef(null);
  const RewardInterfaceRef = useRef(null);
  const editState = useMemo(() => inputState['edit' + 'video' + videoId], [
    inputState,
    videoId
  ]);

  useEffect(() => {
    if (!editState) {
      onSetEditForm({
        contentId: videoId,
        contentType: 'video',
        form: {
          editedDescription: description || '',
          editedTitle: title || '',
          editedUrl: `https://www.youtube.com/watch?v=${content}`
        }
      });
    }
    onSetXpRewardInterfaceShown({
      contentId: videoId,
      contentType: 'video',
      shown: false
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editState, isEditing, title, description, content]);

  useEffect(() => {
    onSetXpRewardInterfaceShown({
      contentType: 'video',
      contentId: videoId,
      shown:
        xpRewardInterfaceShown &&
        canReward &&
        authLevel > uploader.authLevel &&
        !userIsUploader
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

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

  const editForm = useMemo(() => editState || {}, [editState]);
  const {
    editedTitle: prevEditedTitle = '',
    editedDescription: prevEditedDescription = '',
    editedUrl: prevEditedUrl = ''
  } = editForm;

  const [editedTitle, setEditedTitle] = useState(prevEditedTitle || title);
  const editedTitleRef = useRef(prevEditedTitle || title);
  useEffect(() => {
    handleTitleChange(prevEditedTitle || title);
  }, [prevEditedTitle, title]);

  const [editedDescription, setEditedDescription] = useState(
    prevEditedDescription || description
  );
  const editedDescriptionRef = useRef(prevEditedDescription || description);
  useEffect(
    () => handleDescriptionChange(prevEditedDescription || description),
    [description, prevEditedDescription]
  );

  const [editedUrl, setEditedUrl] = useState(
    prevEditedUrl || `https://www.youtube.com/watch?v=${content}`
  );
  const editedUrlRef = useRef(
    prevEditedUrl || `https://www.youtube.com/watch?v=${content}`
  );
  useEffect(
    () =>
      handleUrlChange(
        prevEditedUrl || `https://www.youtube.com/watch?v=${content}`
      ),
    [content, prevEditedUrl]
  );

  const userIsUploader = uploader.id === userId;

  const editButtonShown = useMemo(() => {
    const userCanEditThis =
      (canEdit || canDelete) && authLevel > uploader.authLevel;
    return userIsUploader || userCanEditThis;
  }, [authLevel, canDelete, canEdit, uploader.authLevel, userIsUploader]);

  const userCanRewardThis = useMemo(
    () =>
      determineUserCanRewardThis({
        authLevel,
        canReward,
        recommendations,
        uploader,
        userId
      }),
    [authLevel, canReward, recommendations, uploader, userId]
  );

  const rewardButtonShown = useMemo(() => {
    return !isEditing && userCanRewardThis;
  }, [isEditing, userCanRewardThis]);

  const xpButtonDisabled = useMemo(
    () =>
      determineXpButtonDisabled({
        rewardLevel: byUser ? 5 : 0,
        myId: userId,
        xpRewardInterfaceShown,
        rewards
      }),
    [byUser, rewards, userId, xpRewardInterfaceShown]
  );

  const editMenuItems = useMemo(() => {
    const items = [];
    if (userIsUploader || canEdit) {
      items.push({
        label: 'Edit',
        onClick: handleEditStart
      });
    }
    if (userIsUploader || canDelete) {
      items.push({
        label: 'Delete',
        onClick: onDelete
      });
    }
    return items;

    function handleEditStart() {
      onSetIsEditing({
        contentId: videoId,
        contentType: 'video',
        isEditing: true
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canDelete, canEdit, userIsUploader, videoId]);

  useEffect(() => {
    return function onUnmount() {
      onSetEditForm({
        contentId: videoId,
        contentType: 'video',
        form: {
          editedDescription: editedDescriptionRef.current,
          editedTitle: editedTitleRef.current,
          editedUrl: editedUrlRef.current
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ width: '100%' }}>
      <AlreadyPosted
        changingPage={changingPage}
        style={{ marginBottom: '1rem' }}
        contentId={Number(videoId)}
        contentType="video"
        url={content}
        uploaderId={uploader.id}
        videoCode={content}
      />
      <TagStatus
        style={{ fontSize: '1.5rem' }}
        onAddTags={addTags}
        tags={tags}
        contentId={Number(videoId)}
      />
      <div
        style={{
          padding: '0 1rem 1rem 1rem',
          width: '100%'
        }}
      >
        <div
          style={{ display: 'flex', flexDirection: 'column', width: '100%' }}
        >
          <div
            style={{
              display: 'flex',
              width: '100%',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '1.5rem'
            }}
          >
            <BasicInfos
              className={css`
                width: CALC(100% - 25rem);
                @media (max-width: ${mobileMaxWidth}) {
                  width: CALC(100% - ${canReward ? '15rem' : '12rem'});
                }
              `}
              style={{
                marginRight: '1rem',
                display: 'flex',
                flexDirection: 'column'
              }}
              editedUrl={editedUrl}
              editedTitle={editedTitle}
              onTitleChange={handleTitleChange}
              innerRef={TitleRef}
              onTitleKeyUp={(event) => {
                if (event.key === ' ') {
                  handleTitleChange(addEmoji(event.target.value));
                }
              }}
              onUrlChange={handleUrlChange}
              onEdit={isEditing}
              onMouseLeave={() => setTitleHovered(false)}
              onMouseOver={onMouseOver}
              onTitleClick={() => {
                if (textIsOverflown(TitleRef.current)) {
                  setTitleHovered((titleHovered) => !titleHovered);
                }
              }}
              title={title}
              titleExceedsCharLimit={titleExceedsCharLimit}
              titleHovered={titleHovered}
              timeStamp={timeStamp}
              uploader={uploader}
              urlExceedsCharLimit={urlExceedsCharLimit}
            />
            <SideButtons
              className={css`
                width: 25rem;
                @media (max-width: ${mobileMaxWidth}) {
                  width: ${canReward ? '15rem' : '12rem'};
                }
              `}
              style={{
                marginTop: canEditPlaylists ? 0 : '1rem',
                display: 'flex',
                flexDirection: 'column'
              }}
              byUser={byUser}
              canReward={canReward}
              changeByUserStatus={changeByUserStatus}
              rewardLevel={rewardLevel}
              likes={likes}
              onLikeVideo={handleLikeVideo}
              onSetRewardLevel={onSetRewardLevel}
              uploader={uploader}
              userId={userId}
              videoId={videoId}
            />
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            marginTop: '1rem',
            position: 'relative'
          }}
        >
          <div
            style={{ display: 'flex', flexDirection: 'column', width: '100%' }}
          >
            <Description
              onChange={(event) => handleDescriptionChange(event.target.value)}
              onEdit={isEditing}
              onEditCancel={handleEditCancel}
              onEditFinish={handleEditFinish}
              onKeyUp={(event) => {
                if (event.key === ' ') {
                  handleDescriptionChange(addEmoji(event.target.value));
                }
              }}
              description={description}
              editedDescription={editedDescription}
              descriptionExceedsCharLimit={descriptionExceedsCharLimit}
              determineEditButtonDoneStatus={determineEditButtonDoneStatus}
            />
            {!isEditing && videoViews > 10 && (
              <div
                style={{
                  padding: '1rem 0',
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  color: Color.darkerGray()
                }}
              >
                {addCommasToNumber(videoViews)} view
                {`${videoViews > 1 ? 's' : ''}`}
              </div>
            )}
            <div style={{ display: 'flex', marginTop: '1rem' }}>
              {editButtonShown && !isEditing && (
                <DropdownButton
                  skeuomorphic
                  color="darkerGray"
                  style={{ marginRight: '1rem' }}
                  direction="left"
                  text="Edit or Delete"
                  menuProps={editMenuItems}
                />
              )}
            </div>
          </div>
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0
            }}
          >
            <div style={{ display: 'flex' }}>
              {rewardButtonShown && (
                <Button
                  skeuomorphic
                  color="pink"
                  disabled={xpButtonDisabled}
                  onClick={handleSetXpRewardInterfaceShown}
                >
                  <Icon icon="certificate" />
                  <span style={{ marginLeft: '0.7rem' }}>
                    {xpButtonDisabled || 'Reward'}
                  </span>
                </Button>
              )}
              <Button
                color="orange"
                style={{ marginLeft: '1rem' }}
                skeuomorphic
                filled={isRecommendedByUser}
                disabled={recommendationInterfaceShown}
                onClick={() => setRecommendationInterfaceShown(true)}
              >
                <Icon icon="star" />
              </Button>
            </div>
          </div>
        </div>
        <RecommendationStatus
          style={{
            marginTop: '1rem',
            marginBottom: 0,
            marginLeft: '-1rem',
            marginRight: '-1rem'
          }}
          contentType="video"
          recommendations={recommendations}
        />
        {recommendationInterfaceShown && (
          <RecommendationInterface
            style={{
              marginTop: '1rem',
              fontSize: '1.7rem',
              marginBottom: 0,
              marginLeft: '-1rem',
              marginRight: '-1rem'
            }}
            contentId={videoId}
            contentType="video"
            onHide={() => setRecommendationInterfaceShown(false)}
            recommendations={recommendations}
            uploaderId={uploader.id}
          />
        )}
        {xpRewardInterfaceShown && (
          <XPRewardInterface
            innerRef={RewardInterfaceRef}
            rewardLevel={byUser ? 5 : 0}
            rewards={rewards}
            contentType="video"
            contentId={Number(videoId)}
            noPadding
            onReward={() =>
              setRecommendationInterfaceShown(
                !isRecommendedByUser && twinkleCoins > 0
              )
            }
            uploaderAuthLevel={uploader.authLevel}
            uploaderId={uploader.id}
          />
        )}
      </div>
    </div>
  );

  function determineEditButtonDoneStatus() {
    const urlIsInvalid = !isValidYoutubeUrl(editedUrl);
    const titleIsEmpty = stringIsEmpty(editedTitle);
    const titleChanged = editedTitle !== title;
    const urlChanged =
      editedUrl !== `https://www.youtube.com/watch?v=${content}`;
    const descriptionChanged = editedDescription !== description;
    if (urlIsInvalid) return true;
    if (titleIsEmpty) return true;
    if (!titleChanged && !descriptionChanged && !urlChanged) return true;
    if (urlExceedsCharLimit(editedUrl)) return true;
    if (titleExceedsCharLimit(editedTitle)) return true;
    if (descriptionExceedsCharLimit(editedDescription)) return true;
    return false;
  }

  function handleEditCancel() {
    onSetEditForm({
      contentId: videoId,
      contentType: 'video',
      editForm: undefined
    });
    onSetIsEditing({
      contentId: videoId,
      contentType: 'video',
      isEditing: false
    });
  }

  async function handleEditFinish() {
    const params = {
      contentId: videoId,
      contentType: 'video',
      editedUrl,
      videoId,
      editedTitle: finalizeEmoji(editedTitle),
      editedDescription: finalizeEmoji(editedDescription)
    };
    await onEditFinish(params);
    onSetEditForm({
      contentId: videoId,
      contentType: 'video',
      editForm: undefined
    });
    onSetIsEditing({
      contentId: videoId,
      contentType: 'video',
      isEditing: false
    });
  }

  function handleLikeVideo({ likes, isUnlike }) {
    onLikeVideo({ likes });
    if (!xpButtonDisabled && userCanRewardThis && !isRewardedByUser) {
      onSetXpRewardInterfaceShown({
        contentId: videoId,
        contentType: 'video',
        shown: !isUnlike
      });
    } else {
      if (!isRecommendedByUser && !canReward) {
        setRecommendationInterfaceShown(!isUnlike);
      }
    }
  }

  function handleSetXpRewardInterfaceShown() {
    onSetXpRewardInterfaceShown({
      contentId: videoId,
      contentType: 'video',
      shown: true
    });
  }

  function handleTitleChange(text) {
    setEditedTitle(text);
    editedTitleRef.current = text;
  }

  function handleDescriptionChange(text) {
    setEditedDescription(text);
    editedDescriptionRef.current = text;
  }

  function handleUrlChange(text) {
    setEditedUrl(text);
    editedUrlRef.current = text;
  }

  function onMouseOver() {
    if (!isMobile(navigator) && textIsOverflown(TitleRef.current)) {
      setTitleHovered(true);
    }
  }

  function descriptionExceedsCharLimit(description) {
    return exceedsCharLimit({
      contentType: 'video',
      inputType: 'description',
      text: description
    });
  }

  function titleExceedsCharLimit(title) {
    return exceedsCharLimit({
      contentType: 'video',
      inputType: 'title',
      text: title
    });
  }

  function urlExceedsCharLimit(url) {
    return exceedsCharLimit({
      contentType: 'video',
      inputType: 'url',
      text: url
    });
  }
}
