import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/Icon';
import Button from 'components/Button';
import OptionItem from './OptionItem';
import ReorderOptionsModal from './ReorderOptionsModal';

OptionsField.propTypes = {
  editedOptionIds: PropTypes.array.isRequired,
  editedOptionsObj: PropTypes.object.isRequired,
  onSetInputState: PropTypes.func.isRequired,
  style: PropTypes.object
};

export default function OptionsField({
  editedOptionIds,
  editedOptionsObj,
  onSetInputState,
  style
}) {
  const [reorderOptionsModalShown, setReorderOptionsModalShown] = useState(
    false
  );
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        ...style
      }}
    >
      {editedOptionIds.map((optionId, index) => {
        const option = editedOptionsObj[optionId];
        return (
          <OptionItem
            key={optionId}
            editedOptionIds={editedOptionIds}
            editedOptionsObj={editedOptionsObj}
            onSetInputState={onSetInputState}
            option={option}
            style={{ marginTop: index === 0 ? 0 : '1rem' }}
          />
        );
      })}
      <div
        style={{
          marginTop: '3rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Button skeuomorphic onClick={handleAddOption}>
          <Icon icon="plus" />
          <span style={{ marginLeft: '0.7rem' }}>Add</span>
        </Button>
        <Button
          style={{ marginTop: '1rem' }}
          skeuomorphic
          onClick={() => setReorderOptionsModalShown(true)}
        >
          <Icon icon="bars" />
          <span style={{ marginLeft: '0.7rem' }}>Reorder</span>
        </Button>
      </div>
      {reorderOptionsModalShown && (
        <ReorderOptionsModal
          optionIds={editedOptionIds}
          optionsObj={editedOptionsObj}
          onSubmit={(optionIds) =>
            onSetInputState({
              editedOptionIds: optionIds
            })
          }
          onHide={() => setReorderOptionsModalShown(false)}
        />
      )}
    </div>
  );

  function handleAddOption() {
    let nextOptionId = 0;
    for (let i = 1; i <= editedOptionIds.length + 1; i++) {
      if (!editedOptionIds.includes(i)) {
        nextOptionId = i;
        break;
      }
    }
    onSetInputState({
      editedOptionIds: [...editedOptionIds, nextOptionId],
      editedOptionsObj: {
        ...editedOptionsObj,
        [nextOptionId]: {
          id: nextOptionId,
          label: `option ${nextOptionId}`
        }
      }
    });
  }
}
