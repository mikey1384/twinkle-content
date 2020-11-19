import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import Button from 'components/Button';
import StartScreen from './StartScreen';

AddPictureModal.propTypes = {
  onHide: PropTypes.func.isRequired
};

export default function AddPictureModal({ onHide }) {
  return (
    <Modal onHide={onHide}>
      <header>Add Picture</header>
      <main>
        <StartScreen />
      </main>
      <footer>
        <Button color="blue" onClick={onHide}>
          OK
        </Button>
      </footer>
    </Modal>
  );
}
