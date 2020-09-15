import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/Icon';
import { Color } from 'constants/css';

OptionItem.propTypes = {
  option: PropTypes.object,
  style: PropTypes.object
};

export default function OptionItem({ option, style }) {
  return (
    <div
      key={option.id}
      style={{
        fontSize: '1.5rem',
        padding: '1rem 2rem',
        border: `1px solid ${Color.borderGray()}`,
        ...style
      }}
    >
      {option.icon && <Icon icon={option.icon} />}
      <span style={{ marginLeft: '0.7rem' }}>{option.label}</span>
    </div>
  );
}
