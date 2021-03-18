import React, { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import ProfilePic from 'components/ProfilePic';
import UsernameText from 'components/Texts/UsernameText';
import LongText from 'components/Texts/LongText';
import EditTextArea from 'components/Texts/EditTextArea';
import DropdownButton from 'components/Buttons/DropdownButton';
import ErrorBoundary from 'components/ErrorBoundary';
import Icon from 'components/Icon';
import { css } from '@emotion/css';
import { Color, mobileMaxWidth } from 'constants/css';
import { timeSince } from 'helpers/timeStampHelpers';
import { stringIsEmpty } from 'helpers/stringHelpers';
import { useContentState, useMyState } from 'helpers/hooks';
import { useAppContext, useContentContext } from 'contexts';

Comment.propTypes = {
  contentType: PropTypes.string,
  contentId: PropTypes.number,
  maxRewardables: PropTypes.number.isRequired,
  noMarginForEditButton: PropTypes.bool,
  onEditDone: PropTypes.func,
  reward: PropTypes.object.isRequired
};

function Comment({
  contentType,
  contentId,
  maxRewardables,
  noMarginForEditButton,
  onEditDone = () => {},
  reward
}) {
  const {
    requestHelpers: { editRewardComment, revokeReward }
  } = useAppContext();
  const {
    actions: { onRevokeReward, onSetIsEditing }
  } = useContentContext();
  const { authLevel, canEdit, userId } = useMyState();
  const { isEditing } = useContentState({
    contentType: 'reward',
    contentId: reward.id
  });
  const userIsUploader = reward.rewarderId === userId;
  const editButtonShown = useMemo(() => {
    const userCanEditThis = canEdit && authLevel > reward.rewarderAuthLevel;
    return userIsUploader || userCanEditThis;
  }, [authLevel, canEdit, reward.rewarderAuthLevel, userIsUploader]);
  const editMenuItems = useMemo(() => {
    const items = [];
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
            contentId: reward.id,
            contentType: 'reward',
            isEditing: true
          })
      });
    }
    if (canEdit) {
      items.push({
        label: (
          <>
            <Icon icon="ban" />
            <span style={{ marginLeft: '1rem' }}>Revoke</span>
          </>
        ),
        onClick: handleRevokeReward
      });
    }
    return items;

    async function handleRevokeReward() {
      const success = await revokeReward(reward.id);
      if (success) {
        onRevokeReward({ contentType, contentId, rewardId: reward.id });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canEdit, onSetIsEditing, reward.id, userIsUploader]);

  return (
    <ErrorBoundary>
      <div
        className={css`
          padding: 1rem;
          ${noMarginForEditButton ? `padding-right: 0;` : ''} display: flex;
          align-items: space-between;
        `}
      >
        <div
          className={css`
            width: 6rem;
          `}
        >
          <ProfilePic
            userId={reward.rewarderId}
            profilePicUrl={reward.rewarderProfilePicUrl}
            style={{ width: '5rem', height: '5rem' }}
          />
        </div>
        <div
          className={css`
            width: 100%;
            margin-left: 0.5rem;
            font-size: 1.5rem;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            @media (max-width: ${mobileMaxWidth}) {
              font-size: 1.2rem;
            }
          `}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent:
                stringIsEmpty(reward.rewardComment) && !isEditing && 'center'
            }}
          >
            <div
              style={{
                width: '100%'
              }}
            >
              <UsernameText
                user={{
                  id: reward.rewarderId,
                  username: reward.rewarderUsername
                }}
                userId={userId}
              />{' '}
              <span
                style={{
                  fontWeight: 'bold',
                  color:
                    reward.rewardAmount >= maxRewardables ||
                    reward.rewardAmount >= 10
                      ? Color.gold()
                      : reward.rewardAmount >= 5
                      ? Color.pink()
                      : Color.logoBlue()
                }}
              >
                rewarded {reward.rewardAmount === 1 ? 'a' : reward.rewardAmount}{' '}
                Twinkle
                {reward.rewardAmount > 1 ? 's' : ''}
              </span>{' '}
              <span style={{ fontSize: '1.2rem', color: Color.gray() }}>
                ({timeSince(reward.timeStamp)})
              </span>
            </div>
            <div
              style={{
                width: '100%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'pre-wrap',
                overflowWrap: 'break-word',
                wordBreak: 'break-word'
              }}
            >
              {!isEditing && <LongText>{reward.rewardComment}</LongText>}
              {isEditing && (
                <EditTextArea
                  contentId={reward.id}
                  contentType="reward"
                  allowEmptyText
                  rows={3}
                  text={reward.rewardComment}
                  onCancel={() =>
                    onSetIsEditing({
                      contentId: reward.id,
                      contentType: 'reward',
                      isEditing: false
                    })
                  }
                  onEditDone={handleSubmitEdit}
                />
              )}
            </div>
          </div>
          {editButtonShown && !isEditing && (
            <DropdownButton
              skeuomorphic
              icon="chevron-down"
              color="darkerGray"
              direction="left"
              menuProps={editMenuItems}
            />
          )}
        </div>
      </div>
    </ErrorBoundary>
  );

  async function handleSubmitEdit(editedComment) {
    await editRewardComment({ editedComment, contentId: reward.id });
    onEditDone({ id: reward.id, text: editedComment });
    onSetIsEditing({
      contentId: reward.id,
      contentType: 'reward',
      isEditing: false
    });
  }
}

export default memo(Comment);
