import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import Button from 'components/Button';
import SlideListItem from '../../../SlideListItem';

SelectForkModal.propTypes = {
  interactiveId: PropTypes.number.isRequired,
  onHide: PropTypes.func.isRequired,
  onDone: PropTypes.func.isRequired,
  originForkId: PropTypes.number,
  slideObj: PropTypes.object
};

export default function SelectForkModal({
  interactiveId,
  onDone,
  onHide,
  originForkId,
  slideObj
}) {
  const mounted = useRef(true);
  const [forkIds, setForkIds] = useState([]);
  const [selectedSlideId, setSelectedSlideId] = useState(null);

  useEffect(() => {
    addForkIds(originForkId);

    function addForkIds(forkId) {
      setForkIds((forkIds) =>
        forkIds.includes(forkId) ? forkIds : forkIds.concat(forkId)
      );
      if (slideObj[forkId]?.forkedFrom) {
        addForkIds(slideObj[forkId].forkedFrom);
      }
    }
  }, [originForkId, slideObj]);

  useEffect(() => {
    return function onDismount() {
      mounted.current = false;
    };
  }, []);

  return (
    <Modal onHide={onHide}>
      <header>Select a Slide</header>
      <main>
        {forkIds.map((id) => (
          <SlideListItem
            key={id}
            style={{ marginTop: '1rem' }}
            slide={slideObj[id]}
            interactiveId={interactiveId}
            selectedSlideId={selectedSlideId}
            onClick={setSelectedSlideId}
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
