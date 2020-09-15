import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/Icon';
import Button from 'components/Button';
import OptionItem from './OptionItem';

OptionsField.propTypes = {
  editedOptions: PropTypes.array.isRequired,
  style: PropTypes.object
};

export default function OptionsField({ editedOptions, style }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        ...style
      }}
    >
      {editedOptions.map((option, index) => (
        <OptionItem
          key={option.id}
          option={option}
          style={{ marginTop: index === 0 ? 0 : '1rem' }}
        />
      ))}
      <div
        style={{
          marginTop: '3rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Button skeuomorphic>
          <Icon icon="plus" />
          <span style={{ marginLeft: '0.7rem' }}>Add</span>
        </Button>
        <Button style={{ marginTop: '1rem' }} skeuomorphic>
          <Icon icon="bars" />
          <span style={{ marginLeft: '0.7rem' }}>Reorder</span>
        </Button>
      </div>
    </div>
  );
}
