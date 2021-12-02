import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import Button from 'components/Button';
import ErrorBoundary from 'components/ErrorBoundary';
import RewardLevelForm from 'components/Forms/RewardLevelForm';
import AlertModal from 'components/Modals/AlertModal';
import { useAppContext } from 'contexts';
import localize from 'constants/localize';

const selectedLanguage = process.env.REACT_APP_SELECTED_LANGUAGE;
const settingCannotBeChangedLabel = localize('settingCannotBeChanged');

RewardLevelModal.propTypes = {
  contentId: PropTypes.number.isRequired,
  contentType: PropTypes.string.isRequired,
  rewardLevel: PropTypes.number,
  onHide: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default function RewardLevelModal({
  contentId,
  contentType,
  rewardLevel: initialRewardLevel = 0,
  onSubmit,
  onHide
}) {
  const {
    requestHelpers: { updateRewardLevel }
  } = useAppContext();
  const [moderatorName, setModeratorName] = useState('');
  const [cannotChangeModalShown, setCannotChangeModalShown] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [rewardLevel, setRewardLevel] = useState(initialRewardLevel);

  const moderatorHasDisabledChangeLabel = useMemo(() => {
    if (selectedLanguage === 'en') {
      return (
        <span>
          <b>{moderatorName}</b> has disabled users from changing this setting
          for this post
        </span>
      );
    }
    return (
      <span>
        <b>{moderatorName}</b>님이 이 설정을 변경하지 못하도록 설정하였습니다
      </span>
    );
  }, [moderatorName]);

  return (
    <Modal onHide={onHide}>
      <ErrorBoundary>
        <header>
          Set Reward Level (consider both difficulty and importance)
        </header>
        <main style={{ fontSize: '3rem', paddingTop: 0 }}>
          <RewardLevelForm
            rewardLevel={rewardLevel}
            onSetRewardLevel={setRewardLevel}
            style={{ marginTop: '5rem', textAlign: 'center' }}
          />
        </main>
        <footer>
          <Button
            transparent
            style={{ marginRight: '0.7rem' }}
            onClick={onHide}
          >
            Cancel
          </Button>
          <Button disabled={disabled} color="blue" onClick={submit}>
            Set
          </Button>
        </footer>
      </ErrorBoundary>
      {cannotChangeModalShown && (
        <AlertModal
          title={settingCannotBeChangedLabel}
          content={moderatorHasDisabledChangeLabel}
          onHide={() => setCannotChangeModalShown(false)}
        />
      )}
    </Modal>
  );

  async function submit() {
    setDisabled(true);
    const { cannotChange, success, moderatorName } = await updateRewardLevel({
      contentId,
      contentType,
      rewardLevel
    });
    if (cannotChange) {
      setModeratorName(moderatorName);
      return setCannotChangeModalShown(true);
    }
    if (success) {
      onSubmit({ contentId, rewardLevel, contentType });
    }
  }
}
