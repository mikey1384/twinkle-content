import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/Icon';
import Button from 'components/Button';

Deleted.propTypes = {
  onRemoveInteractiveSlide: PropTypes.func.isRequired,
  onUndeleteSlide: PropTypes.func.isRequired
};

export default function Deleted({ onRemoveInteractiveSlide, onUndeleteSlide }) {
  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      <div
        style={{
          fontSize: '1.7rem',
          fontWeight: 'bold',
          display: 'flex',
          flexGrow: 1,
          justifyContent: 'center'
        }}
      >
        This slide has been deleted
      </div>
      <div style={{ display: 'flex', marginLeft: '1rem' }}>
        <Button
          style={{ fontSize: '1.3rem' }}
          skeuomorphic
          onClick={onUndeleteSlide}
        >
          <Icon icon="trash-restore" />
          <span style={{ marginLeft: '1rem' }}>Undo</span>
        </Button>
        <Button
          style={{ marginLeft: '1rem', fontSize: '1.3rem' }}
          skeuomorphic
          onClick={onRemoveInteractiveSlide}
        >
          <Icon icon="minus" />
          <span style={{ marginLeft: '1rem' }}>Hide this message</span>
        </Button>
      </div>
    </div>
  );
}
