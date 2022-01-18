import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import InteractiveContent from 'components/InteractiveContent';
import Button from 'components/Button';
import localize from 'constants/localize';

const closeLabel = localize('close');

TutorialModal.propTypes = {
  missionTitle: PropTypes.string.isRequired,
  tutorialId: PropTypes.number,
  onHide: PropTypes.func.isRequired
};

export default function TutorialModal({ missionTitle, tutorialId, onHide }) {
  return (
    <Modal closeWhenClickedOutside={false} large onHide={onHide}>
      <header>{missionTitle}</header>
      <main>
        <InteractiveContent
          interactiveId={tutorialId}
          onGoBackToMission={onHide}
        />
      </main>
      <footer>
        <Button transparent style={{ marginRight: '0.7rem' }} onClick={onHide}>
          {closeLabel}
        </Button>
      </footer>
    </Modal>
  );
}
