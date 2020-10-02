import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import Button from 'components/Button';
import ArchivedSlideItem from './ArchivedSlideItem';
import { useAppContext } from 'contexts';

SelectArchivedSlideModal.propTypes = {
  interactiveId: PropTypes.number.isRequired,
  onHide: PropTypes.func.isRequired,
  archivedSlides: PropTypes.array.isRequired,
  lastFork: PropTypes.object.isRequired
};

export default function SelectArchivedSlideModal({
  interactiveId,
  onHide,
  archivedSlides,
  lastFork
}) {
  const {
    requestHelpers: { recoverArchivedSlide }
  } = useAppContext();
  const mounted = useRef(true);
  const [selectedSlideId, setSelectedSlideId] = useState(null);

  useEffect(() => {
    mounted.current = true;

    return function onDismount() {
      mounted.current = false;
    };
  }, []);

  return (
    <Modal onHide={onHide}>
      <header>Select a Slide</header>
      <main>
        {archivedSlides.map((slide, index) => (
          <ArchivedSlideItem
            key={slide.id}
            selectedSlideId={selectedSlideId}
            interactiveId={interactiveId}
            slide={slide}
            onSelect={(slideId) => setSelectedSlideId(slideId)}
            style={{ marginTop: index === 0 ? 0 : '1rem' }}
          />
        ))}
      </main>
      <footer>
        <Button transparent onClick={onHide} style={{ marginRight: '0.7rem' }}>
          Cancel
        </Button>
        <Button color="blue" onClick={handleDone}>
          Done
        </Button>
      </footer>
    </Modal>
  );

  async function handleDone() {
    await recoverArchivedSlide({ selectedSlideId, lastFork });
    onHide();
  }
}
