import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import Button from 'components/Button';
import ArchivedSlideItem from './ArchivedSlideItem';

SelectArchivedSlideModal.propTypes = {
  interactiveId: PropTypes.number.isRequired,
  onHide: PropTypes.func.isRequired,
  archivedSlides: PropTypes.array.isRequired
};

export default function SelectArchivedSlideModal({
  interactiveId,
  onHide,
  archivedSlides
}) {
  return (
    <Modal onHide={onHide}>
      <header>Select an icon</header>
      <main>
        {archivedSlides.map((slide, index) => (
          <ArchivedSlideItem
            key={slide.id}
            interactiveId={interactiveId}
            slide={slide}
            style={{ marginTop: index === 0 ? 0 : '1rem' }}
          />
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
