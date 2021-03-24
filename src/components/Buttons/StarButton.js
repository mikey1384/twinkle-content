import React, { useMemo, useRef, useState } from 'react';
import { useContentState, useMyState, useOutsideClick } from 'helpers/hooks';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import Icon from 'components/Icon';
import DropdownList from 'components/DropdownList';
import RewardLevelModal from 'components/Modals/RewardLevelModal';
import ErrorBoundary from 'components/ErrorBoundary';
import AlertModal from 'components/Modals/AlertModal';
import { useAppContext } from 'contexts';
import { DESCRIPTION_LENGTH_FOR_EXTRA_REWARD_LEVEL } from 'constants/defaultValues';

StarButton.propTypes = {
  byUser: PropTypes.bool,
  contentId: PropTypes.number,
  rewardLevel: PropTypes.number,
  direction: PropTypes.string,
  defaultDescription: PropTypes.string,
  filePath: PropTypes.string,
  filled: PropTypes.bool,
  onSetRewardLevel: PropTypes.func,
  onToggleByUser: PropTypes.func,
  style: PropTypes.object,
  contentType: PropTypes.string.isRequired,
  skeuomorphic: PropTypes.bool,
  uploader: PropTypes.object
};

export default function StarButton({
  byUser,
  contentId,
  contentType,
  defaultDescription,
  filePath,
  rewardLevel,
  direction = 'left',
  filled,
  onSetRewardLevel,
  onToggleByUser,
  uploader,
  skeuomorphic,
  style
}) {
  const { canReward, canEditRewardLevel, userId } = useMyState();
  const {
    requestHelpers: { setByUser }
  } = useAppContext();
  const { description } = useContentState({ contentId, contentType });
  const [cannotChangeModalShown, setCannotChangeModalShown] = useState(false);
  const [moderatorName, setModeratorName] = useState('');
  const [rewardLevelModalShown, setRewardLevelModalShown] = useState(false);
  const [menuShown, setMenuShown] = useState(false);

  const writtenByButtonShown = useMemo(
    () =>
      contentType === 'subject' &&
      !filePath &&
      (description || defaultDescription)?.length >
        DESCRIPTION_LENGTH_FOR_EXTRA_REWARD_LEVEL,
    [contentType, defaultDescription, description, filePath]
  );
  const showsDropdownWhenClicked = useMemo(() => {
    return (
      uploader &&
      (contentType === 'video' ||
        contentType === 'url' ||
        (contentType === 'subject' && (filePath || writtenByButtonShown)))
    );
  }, [contentType, filePath, uploader, writtenByButtonShown]);
  const StarButtonRef = useRef(null);
  useOutsideClick(StarButtonRef, () => setMenuShown(false));
  const makerLabel = useMemo(() => {
    return uploader?.id === userId ? 'me' : uploader?.username;
  }, [uploader?.id, uploader?.username, userId]);
  const buttonShown = useMemo(() => {
    return (
      canEditRewardLevel ||
      (showsDropdownWhenClicked && (uploader?.id === userId || canReward))
    );
  }, [
    canEditRewardLevel,
    canReward,
    showsDropdownWhenClicked,
    uploader?.id,
    userId
  ]);

  return buttonShown ? (
    <ErrorBoundary>
      <div ref={StarButtonRef}>
        <Button
          style={style}
          skeuomorphic={!(!!rewardLevel || byUser || filled) && skeuomorphic}
          color={!!rewardLevel && byUser ? 'gold' : byUser ? 'orange' : 'pink'}
          filled={!!rewardLevel || byUser || filled}
          onClick={onClick}
        >
          <Icon icon="star" />
        </Button>
        {menuShown && (
          <DropdownList
            direction={direction}
            style={{
              marginTop: '0.5rem',
              position: 'absolute',
              right: 0,
              width: '25rem'
            }}
          >
            {(contentType === 'video' || contentType === 'subject') &&
              canEditRewardLevel && (
                <li onClick={handleShowRewardLevelModal}>Set Reward Level</li>
              )}
            <li onClick={toggleByUser}>
              {byUser
                ? `This wasn't ${
                    writtenByButtonShown ? 'written' : 'made'
                  } by ${makerLabel}`
                : `This was ${
                    writtenByButtonShown ? 'written' : 'made'
                  } by ${makerLabel}`}
            </li>
          </DropdownList>
        )}
      </div>
      {rewardLevelModalShown && (
        <RewardLevelModal
          contentType={contentType}
          contentId={contentId}
          rewardLevel={rewardLevel}
          onSubmit={(data) => {
            onSetRewardLevel({ ...data, contentType, contentId });
            setRewardLevelModalShown(false);
          }}
          onHide={() => setRewardLevelModalShown(false)}
        />
      )}
      {cannotChangeModalShown && (
        <AlertModal
          title="This setting cannot be changed"
          content={
            <span>
              <b>{moderatorName}</b> has disabled users from changing this
              setting for this post
            </span>
          }
          onHide={() => setCannotChangeModalShown(false)}
        />
      )}
    </ErrorBoundary>
  ) : null;

  function onClick() {
    if (showsDropdownWhenClicked) {
      return setMenuShown(!menuShown);
    }
    return setRewardLevelModalShown(true);
  }

  function handleShowRewardLevelModal() {
    setRewardLevelModalShown(true);
    setMenuShown(false);
  }

  async function toggleByUser() {
    const { byUser, cannotChange, moderatorName: modName } = await setByUser({
      contentType,
      contentId
    });
    if (cannotChange) {
      setModeratorName(modName);
      return setCannotChangeModalShown(true);
    }
    onToggleByUser(byUser);
    setMenuShown(false);
  }
}
