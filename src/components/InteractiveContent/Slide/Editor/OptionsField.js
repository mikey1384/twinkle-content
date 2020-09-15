import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/Icon';

OptionsField.propTypes = {
  editedOptions: PropTypes.array.isRequired
};

export default function OptionsField({ editedOptions }) {
  return (
    <div
      style={{
        marginTop: '5rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      {editedOptions.map((option, index) => (
        <div key={option.id} style={{ marginTop: index === 0 ? 0 : '1rem' }}>
          {option.icon && <Icon icon={option.icon} />}
          <span style={{ marginLeft: '0.7rem' }}>{option.label}</span>
        </div>
      ))}
    </div>
  );
}
