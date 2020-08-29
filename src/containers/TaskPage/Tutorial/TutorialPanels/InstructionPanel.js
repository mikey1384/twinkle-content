import React from 'react';
import PropTypes from 'prop-types';
import { panel } from '../../Styles';

InstructionPanel.propTypes = {
  image: PropTypes.string,
  style: PropTypes.object,
  title: PropTypes.string
};

export default function InstructionPanel({ image, style, title }) {
  return (
    <div
      className={panel}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: '5rem',
        ...style
      }}
    >
      <p style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{title}</p>
      <div style={{ width: '80%', marginTop: '3rem' }}>
        <img style={{ width: '100%' }} src={image} />
      </div>
    </div>
  );
}
