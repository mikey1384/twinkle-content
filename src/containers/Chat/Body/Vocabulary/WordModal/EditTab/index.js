import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import FilterBar from 'components/FilterBar';
import Reorder from './Reorder';
import Remove from './Remove';
import { mobileMaxWidth } from 'constants/css';
import { css } from '@emotion/css';
import { isEqual } from 'lodash';
import { useAppContext, useKeyContext } from 'contexts';
import { capitalize } from 'helpers/stringHelpers';

EditTab.propTypes = {
  deletedDefIds: PropTypes.array.isRequired,
  editedDefinitionOrder: PropTypes.object.isRequired,
  onEditWord: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
  originalDefinitionOrder: PropTypes.object.isRequired,
  originalPosOrder: PropTypes.array.isRequired,
  posObj: PropTypes.object.isRequired,
  onSetEditedDefinitionOrder: PropTypes.func.isRequired,
  word: PropTypes.string.isRequired
};

export default function EditTab({
  deletedDefIds: originalDeletedIds = [],
  editedDefinitionOrder,
  onEditWord,
  onHide,
  originalPosOrder,
  originalDefinitionOrder,
  posObj,
  onSetEditedDefinitionOrder,
  word
}) {
  const editWord = useAppContext((v) => v.requestHelpers.editWord);
  const { canDelete } = useKeyContext((v) => v.myState);
  const {
    done: { color: doneColor }
  } = useKeyContext((v) => v.theme);
  const [selectedTab, setSelectedTab] = useState('reorder');
  const [posting, setPosting] = useState(false);
  const [poses, setPoses] = useState([]);
  const [deletedDefIds, setDeletedDefIds] = useState(originalDeletedIds);

  const disabled = useMemo(() => {
    let deletedDefIdsAreTheSame = false;
    let deletedDefIdsAreIncludedInTheOriginal = true;
    for (let deletedId of deletedDefIds) {
      if (!originalDeletedIds.includes(deletedId)) {
        deletedDefIdsAreIncludedInTheOriginal = false;
        break;
      }
    }
    deletedDefIdsAreTheSame =
      deletedDefIdsAreIncludedInTheOriginal &&
      deletedDefIds.length === originalDeletedIds.length;

    return (
      isEqual(originalPosOrder, poses) &&
      isEqual(originalDefinitionOrder, editedDefinitionOrder) &&
      deletedDefIdsAreTheSame
    );
  }, [
    deletedDefIds,
    editedDefinitionOrder,
    originalDefinitionOrder,
    originalDeletedIds,
    originalPosOrder,
    poses
  ]);

  useEffect(() => {
    setPoses(originalPosOrder);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <main>
        <p
          className={css`
            font-weight: bold;
            font-size: 3rem;
            width: 100%;
            @media (max-width: ${mobileMaxWidth}) {
              font-size: 2rem;
            }
          `}
        >
          {`${capitalize(selectedTab)} Definitions of "${word}"`}
        </p>
        {canDelete && (
          <FilterBar style={{ marginTop: '0.5rem', marginBottom: '2rem' }}>
            <nav
              className={selectedTab === 'reorder' ? 'active' : ''}
              onClick={() => setSelectedTab('reorder')}
            >
              Reorder
            </nav>
            <nav
              className={selectedTab === 'remove' ? 'active' : ''}
              onClick={() => setSelectedTab('remove')}
            >
              Remove
            </nav>
          </FilterBar>
        )}
        {selectedTab === 'reorder' && (
          <Reorder
            deletedDefIds={originalDeletedIds}
            editedDefinitionOrder={editedDefinitionOrder}
            onSetEditedDefinitionOrder={onSetEditedDefinitionOrder}
            onSetPoses={setPoses}
            poses={poses}
            posObj={posObj}
          />
        )}
        {selectedTab === 'remove' && (
          <Remove
            editedDefinitionOrder={editedDefinitionOrder}
            onListItemClick={handleRemoveListItemClick}
            poses={poses}
            posObj={posObj}
            deletedDefIds={deletedDefIds}
          />
        )}
      </main>
      <footer>
        <Button transparent style={{ marginRight: '0.7rem' }} onClick={onHide}>
          Close
        </Button>
        <Button
          color={doneColor}
          disabled={disabled || posting}
          onClick={() => handleEditDone({ poses, editedDefinitionOrder })}
        >
          Apply
        </Button>
      </footer>
    </>
  );

  async function handleEditDone({ poses, editedDefinitionOrder }) {
    setPosting(true);
    await editWord({
      editedDefinitionOrder,
      deletedDefIds,
      partOfSpeeches: poses,
      word
    });
    onEditWord({
      deletedDefIds,
      partOfSpeeches: poses,
      editedDefinitionOrder,
      word
    });
    setPosting(false);
  }

  function handleRemoveListItemClick(defId) {
    setDeletedDefIds((defIds) => {
      if (defIds.includes(defId)) {
        return defIds.filter((id) => id !== defId);
      } else {
        return [...defIds, defId];
      }
    });
  }
}
