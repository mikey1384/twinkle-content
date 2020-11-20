import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import Button from 'components/Button';
import StartScreen from './StartScreen';
import SelectFromArchive from './SelectFromArchive';

AddPictureModal.propTypes = {
  onConfirm: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired
};

export default function AddPictureModal({ onConfirm, onHide }) {
  const [section, setSection] = useState('start');
  const [selected, setSelected] = useState(null);
  return (
    <Modal large={section === 'archive'} onHide={onHide}>
      <header>
        Add Picture{section === 'archive' ? `s from Archive` : ''}
      </header>
      <main>
        {section === 'start' && (
          <StartScreen navigateTo={setSection} onHide={onHide} />
        )}
        {section === 'archive' && <SelectFromArchive />}
      </main>
      <footer>
        <Button
          transparent
          onClick={
            section === 'start'
              ? onHide
              : () => {
                  setSection('start');
                  setSelected(null);
                }
          }
        >
          {section === 'start' ? 'Cancel' : 'Back'}
        </Button>
        {section !== 'start' && (
          <Button
            disabled={!selected}
            color="blue"
            style={{ marginLeft: '0.7rem' }}
            onClick={() => onConfirm(selected)}
          >
            Confirm
          </Button>
        )}
      </footer>
    </Modal>
  );
}
