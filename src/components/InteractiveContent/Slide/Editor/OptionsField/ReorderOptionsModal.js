import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import Modal from 'components/Modal';
import SortableListGroup from 'components/SortableListGroup';
import Button from 'components/Button';
import { isEqual } from 'lodash';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { isMobile } from 'helpers';

const Backend = isMobile(navigator) ? TouchBackend : HTML5Backend;

ReorderOptionsModal.propTypes = {
  onHide: PropTypes.func.isRequired,
  optionsObj: PropTypes.object.isRequired,
  optionIds: PropTypes.array.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default function ReorderOptionsModal({
  onHide,
  optionsObj,
  optionIds: initialOptionIds,
  onSubmit
}) {
  const [optionIds, setOptionIds] = useState(initialOptionIds);
  return (
    <ErrorBoundary>
      <DndProvider backend={Backend}>
        <Modal small onHide={onHide}>
          <header>Reorder Options</header>
          <main>
            <SortableListGroup
              listItemObj={optionsObj}
              onMove={handleMove}
              itemIds={optionIds}
            />
          </main>
          <footer>
            <Button
              transparent
              style={{ marginRight: '0.7rem' }}
              onClick={onHide}
            >
              Cancel
            </Button>
            <Button
              disabled={isEqual(initialOptionIds, optionIds)}
              color="blue"
              onClick={handleSubmit}
            >
              Done
            </Button>
          </footer>
        </Modal>
      </DndProvider>
    </ErrorBoundary>
  );

  function handleMove({ sourceId, targetId }) {
    const sourceIndex = optionIds.indexOf(sourceId);
    const targetIndex = optionIds.indexOf(targetId);
    const newOptionIds = [...optionIds];
    newOptionIds.splice(sourceIndex, 1);
    newOptionIds.splice(targetIndex, 0, sourceId);
    setOptionIds(newOptionIds);
  }

  async function handleSubmit() {
    onSubmit(optionIds);
    onHide();
  }
}
