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
    <div>
      <Button skeuomorphic onClick={onRemoveInteractiveSlide}>
        <Icon icon="minus" />
        <span style={{ marginLeft: '1rem' }}>Remove</span>
      </Button>
      <Button skeuomorphic onClick={onUndeleteSlide}>
        <Icon icon="trash-restore" />
        <span style={{ marginLeft: '1rem' }}>Undelete</span>
      </Button>
    </div>
  );
}
