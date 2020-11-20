import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import Button from 'components/Button';
import StartScreen from './StartScreen';
import SelectFromArchive from './SelectFromArchive';

AddPictureModal.propTypes = {
  maxNumSelectable: PropTypes.number.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired
};

export default function AddPictureModal({
  maxNumSelectable,
  onConfirm,
  onHide
}) {
  const [section, setSection] = useState('start');
  const [selectedPictureIds, setSelectedPictureIds] = useState([]);

  return (
    <Modal large={section === 'archive'} onHide={onHide}>
      <header>
        Add Picture{section === 'archive' ? `s from Archive` : ''}
      </header>
      <main>
        {section === 'start' && (
          <StartScreen navigateTo={setSection} onHide={onHide} />
        )}
        {section === 'archive' && (
          <SelectFromArchive
            selectedPictureIds={selectedPictureIds}
            onSetSelectedPictureIds={setSelectedPictureIds}
          />
        )}
      </main>
      <footer>
        <Button
          transparent
          onClick={
            section === 'start'
              ? onHide
              : () => {
                  setSection('start');
                  setSelectedPictureIds([]);
                }
          }
        >
          {section === 'start' ? 'Cancel' : 'Back'}
        </Button>
        {section !== 'start' && (
          <Button
            disabled={
              selectedPictureIds.length === 0 ||
              selectedPictureIds.length > maxNumSelectable
            }
            color="blue"
            style={{ marginLeft: '0.7rem' }}
            onClick={() => onConfirm(selectedPictureIds)}
          >
            {selectedPictureIds.length > maxNumSelectable
              ? `Cannot select more than ${maxNumSelectable}`
              : 'Confirm'}
          </Button>
        )}
      </footer>
    </Modal>
  );
}
