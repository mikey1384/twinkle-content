import React from 'react';
import PropTypes from 'prop-types';
import { borderRadius, Color } from 'constants/css';

FailMessage.propTypes = {
  message: PropTypes.oneOfType([PropTypes.string, PropTypes.node])
};
export default function FailMessage({ message }) {
  return (
    <div
      style={{
        marginTop: '1rem',
        padding: '1rem',
        border: `1px solid ${Color.cranberry()}`,
        borderRadius,
        textAlign: 'center',
        color: '#fff',
        background: Color.cranberry(0.6),
        fontSize: '1.7rem',
        fontWeight: 'bold'
      }}
    >
      {message}
    </div>
  );
}
