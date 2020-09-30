import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import Icon from 'components/Icon';
import { useAppContext, useInteractiveContext } from 'contexts';
import { borderRadius, Color } from 'constants/css';

AddSlide.propTypes = {
  interactiveId: PropTypes.number.isRequired,
  lastFork: PropTypes.bool.isRequired
};

export default function AddSlide({ interactiveId, lastFork }) {
  const {
    requestHelpers: { addInteractiveSlide }
  } = useAppContext();
  const {
    actions: { onAddNewInteractiveSlide }
  } = useInteractiveContext();
  const forkOptionNotSelected = useMemo(() => {
    return lastFork && !lastFork.selectedOptionId;
  }, [lastFork]);

  return (
    <div
      style={{
        background: forkOptionNotSelected ? Color.logoBlue() : '#fff',
        color: forkOptionNotSelected ? '#fff' : Color.black(),
        borderRadius,
        padding: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        border: `1px solid ${
          forkOptionNotSelected ? Color.logoBlue() : Color.borderGray()
        }`
      }}
    >
      <div style={{ display: 'flex' }}>
        {forkOptionNotSelected ? (
          <div style={{ fontSize: '2.5rem' }}>
            <Icon icon="arrow-up" />
            <span style={{ marginLeft: '1rem' }}>
              Please select a branch first
            </span>
          </div>
        ) : (
          <Button onClick={handleAddNewSlide} skeuomorphic>
            <Icon icon="plus" />
            <span style={{ marginLeft: '0.7rem' }}>Add a Slide</span>
          </Button>
        )}
      </div>
    </div>
  );

  async function handleAddNewSlide() {
    const slide = await addInteractiveSlide({ interactiveId, lastFork });
    onAddNewInteractiveSlide({ interactiveId, slide });
  }
}
