import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import Button from 'components/Button';
import StartScreen from './StartScreen';

AddPictureModal.propTypes = {
  onHide: PropTypes.func.isRequired
};

export default function AddPictureModal({ onHide }) {
  const [section, setSection] = useState('start');
  return (
    <Modal large={section === 'archive'} onHide={onHide}>
      <header>Add Picture</header>
      <main>
        {section === 'start' && (
          <StartScreen navigateTo={setSection} onHide={onHide} />
        )}
        {section === 'archive' && <div>This is archive</div>}
      </main>
      <footer>
        <Button color="blue" onClick={onHide}>
          OK
        </Button>
      </footer>
    </Modal>
  );
}
