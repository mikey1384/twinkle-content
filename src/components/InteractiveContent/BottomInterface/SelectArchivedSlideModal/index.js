import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import Button from 'components/Button';

SelectArchivedSlideModal.propTypes = {
  onHide: PropTypes.func.isRequired,
  archivedSlides: PropTypes.array.isRequired
};

export default function SelectArchivedSlideModal({ onHide, archivedSlides }) {
  return (
    <Modal onHide={onHide}>
      <header>Select an icon</header>
      <main>
        {archivedSlides.map((slide) => (
          <div key={slide.id}>
            <div>{slide.header}</div>
            <div>{slide.description}</div>
          </div>
        ))}
      </main>
      <footer>
        <Button transparent onClick={onHide} style={{ marginRight: '0.7rem' }}>
          Cancel
        </Button>
        <Button
          color="blue"
          onClick={() => {
            onHide();
          }}
        >
          Done
        </Button>
      </footer>
    </Modal>
  );
}
