import React from 'react';
import PropTypes from 'prop-types';
import ProgressBar from 'components/ProgressBar';
import { borderRadius, Color } from 'constants/css';

ShopPanel.propTypes = {
  style: PropTypes.object,
  title: PropTypes.string,
  children: PropTypes.node
};

export default function ShopPanel({ children, style, title }) {
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
      <h2>{title} (locked)</h2>
      <div style={{ marginTop: '1rem' }}>
        <div style={{ fontSize: '1.5rem' }}>50 Karma Points out of 1000</div>
        <ProgressBar color="blue" progress={50} />
      </div>
      <div style={{ marginTop: '1rem' }}>{children}</div>
    </div>
  );
}
