import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import Button from 'components/Button';
import SortableListGroup from 'components/SortableListGroup';
import { objectify } from 'helpers';
import { isEqual } from 'lodash';
import { useAppContext, useExploreContext } from 'contexts';

ReorderFeaturedSubjects.propTypes = {
  subjectIds: PropTypes.array.isRequired,
  onHide: PropTypes.func.isRequired
};

export default function ReorderFeaturedSubjects({
  onHide,
  subjectIds: initialSubjectIds
}) {
  const {
    requestHelpers: { uploadFeaturedSubjects }
  } = useAppContext();
  const {
    state: {
      subjects: { featured: featuredSubjects }
    },
    actions: { onLoadFeaturedSubjects }
  } = useExploreContext();
  const [subjectIds, setSubjectIds] = useState(initialSubjectIds);
  const [disabled, setDisabled] = useState(false);
  const listItemObj = objectify(featuredSubjects);

  return (
    <Modal onHide={onHide}>
      <header>Reorder Featured Subjects</header>
      <main>
        <SortableListGroup
          listItemLabel="title"
          listItemObj={listItemObj}
          onMove={handleMove}
          itemIds={subjectIds}
        />
      </main>
      <footer>
        <Button transparent style={{ marginRight: '0.7rem' }} onClick={onHide}>
          Cancel
        </Button>
        <Button
          disabled={
            isEqual(
              subjectIds,
              featuredSubjects.map((subject) => subject.id)
            ) || disabled
          }
          color="blue"
          onClick={handleSubmit}
        >
          Done
        </Button>
      </footer>
    </Modal>
  );

  function handleMove({ sourceId, targetId }) {
    const sourceIndex = subjectIds.indexOf(sourceId);
    const targetIndex = subjectIds.indexOf(targetId);
    const newSubjectIds = [...subjectIds];
    newSubjectIds.splice(sourceIndex, 1);
    newSubjectIds.splice(targetIndex, 0, sourceId);
    setSubjectIds(newSubjectIds);
  }

  async function handleSubmit() {
    setDisabled(true);
    const newSelectedSubjects = await uploadFeaturedSubjects({
      selected: subjectIds
    });
    onLoadFeaturedSubjects(newSelectedSubjects);
    onHide();
  }
}
