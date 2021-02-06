import React, { useRef, useState } from 'react';
import { useOutsideClick } from 'helpers/hooks';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import Icon from 'components/Icon';
import DropdownList from 'components/DropdownList';
import RewardLevelModal from 'components/Modals/RewardLevelModal';
import ErrorBoundary from 'components/ErrorBoundary';
import { useAppContext } from 'contexts';

StarButton.propTypes = {
  byUser: PropTypes.bool,
  contentId: PropTypes.number,
  rewardLevel: PropTypes.number,
  direction: PropTypes.string,
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
  const {
    requestHelpers: { setByUser }
  } = useAppContext();
  const [rewardLevelModalShown, setRewardLevelModalShown] = useState(false);
  const [menuShown, setMenuShown] = useState(false);
  const StarButtonRef = useRef(null);
  useOutsideClick(StarButtonRef, () => setMenuShown(false));

  return (
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
            {(contentType === 'video' || contentType === 'subject') && (
              <li onClick={showRewardLevelModal}>Set Reward Level</li>
            )}
            <li onClick={toggleByUser}>
              {byUser
                ? `This wasn't made by ${uploader.username}`
                : `This was made by ${uploader.username}`}
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
    </ErrorBoundary>
  );

  function onClick() {
    if (
      uploader &&
      (contentType === 'video' ||
        contentType === 'url' ||
        (contentType === 'subject' && filePath))
    ) {
      return setMenuShown(!menuShown);
    }
    return setRewardLevelModalShown(true);
  }

  function showRewardLevelModal() {
    setRewardLevelModalShown(true);
    setMenuShown(false);
  }

  async function toggleByUser() {
    const byUser = await setByUser({ contentType, contentId });
    onToggleByUser(byUser);
    setMenuShown(false);
  }
}
