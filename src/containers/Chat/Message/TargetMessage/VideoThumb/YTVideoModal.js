import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import Button from 'components/Button';
import localize from 'constants/localize';

const closelLabel = localize('close');

YTVideoModal.propTypes = {
  onHide: PropTypes.func.isRequired
};

export default function YTVideoModal({ onHide }) {
  return (
    <Modal onHide={onHide}>
      <header>Video Player</header>
      <main style={{ fontSize: '3rem', paddingTop: 0 }}>video goes here</main>
      <footer>
        <Button transparent style={{ marginRight: '0.7rem' }} onClick={onHide}>
          {closelLabel}
        </Button>
      </footer>
    </Modal>
  );
}
