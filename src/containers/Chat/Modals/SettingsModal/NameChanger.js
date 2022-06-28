import React from 'react';
import PropTypes from 'prop-types';
import Input from 'components/Texts/Input';

NameChanger.propTypes = {
  editedChannelName: PropTypes.string.isRequired,
  onSetEditedChannelName: PropTypes.func.isRequired,
  userIsChannelOwner: PropTypes.bool
};
export default function NameChanger({
  editedChannelName,
  onSetEditedChannelName,
  userIsChannelOwner
}) {
  return (
    <div style={{ width: '100%' }}>
      {userIsChannelOwner && (
        <p style={{ fontWeight: 'bold', fontSize: '1.7rem' }}>Group Name:</p>
      )}
      <Input
        style={{ marginTop: '0.5rem', width: '100%' }}
        autoFocus
        placeholder="Enter group name..."
        value={editedChannelName}
        onChange={onSetEditedChannelName}
      />
    </div>
  );
}
