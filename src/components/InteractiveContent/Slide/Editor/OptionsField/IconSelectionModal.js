import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import Button from 'components/Button';

IconSelectionModal.propTypes = {
  onHide: PropTypes.func.isRequired
};

export default function IconSelectionModal({ onHide }) {
  return (
    <Modal onHide={onHide}>
      <header>Select an icon</header>
      <main>Here are the icons</main>
      <footer>
        <Button transparent onClick={onHide} style={{ marginRight: '0.7rem' }}>
          Cancel
        </Button>
        <Button onClick={() => console.log('clicked')}>Done</Button>
      </footer>
    </Modal>
  );
}
