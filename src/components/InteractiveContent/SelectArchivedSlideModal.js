import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import Button from 'components/Button';
import SlideListItem from './SlideListItem';

SelectArchivedSlideModal.propTypes = {
  interactiveId: PropTypes.number.isRequired,
  onHide: PropTypes.func.isRequired,
  archivedSlides: PropTypes.array.isRequired,
  onDone: PropTypes.func.isRequired
};

export default function SelectArchivedSlideModal({
  interactiveId,
  onDone,
  onHide,
  archivedSlides
}) {
  const mounted = useRef(true);
  const [selectedSlideId, setSelectedSlideId] = useState(null);

  useEffect(() => {
    return function onDismount() {
      mounted.current = false;
    };
  }, []);

  return (
    <Modal onHide={onHide}>
      <header>Select a Slide</header>
      <main>
        {archivedSlides.map((slide, index) => (
          <SlideListItem
            key={slide.id}
            selectedSlideId={selectedSlideId}
            interactiveId={interactiveId}
            slide={slide}
            onClick={(slideId) => setSelectedSlideId(slideId)}
            style={{ marginTop: index === 0 ? 0 : '1rem' }}
          />
        ))}
      </main>
      <footer>
        <Button transparent onClick={onHide} style={{ marginRight: '0.7rem' }}>
          Cancel
        </Button>
        <Button
          disabled={!selectedSlideId}
          color="blue"
          onClick={() => onDone(selectedSlideId)}
        >
          Done
        </Button>
      </footer>
    </Modal>
  );
}
