import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import Button from 'components/Button';

WordleModal.propTypes = {
  onHide: PropTypes.func.isRequired
};

export default function WordleModal({ onHide }) {
  return (
    <Modal onHide={onHide}>
      <header>Wordle</header>
      <main>wordle</main>
      <footer>
        <Button transparent style={{ marginRight: '0.7rem' }} onClick={onHide}>
          Cancel
        </Button>
      </footer>
    </Modal>
  );
}
