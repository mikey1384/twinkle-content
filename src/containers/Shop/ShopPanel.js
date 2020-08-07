import React from 'react';
import PropTypes from 'prop-types';
import { borderRadius, Color } from 'constants/css';

ShopPanel.propTypes = {
  style: PropTypes.object
};

export default function ShopPanel({ style }) {
  return (
    <div
      style={{
        borderRadius,
        background: '#fff',
        padding: '1rem',
        border: `1px solid ${Color.borderGray()}`,
        ...style
      }}
    >
      <div>inner</div>
    </div>
  );
}
