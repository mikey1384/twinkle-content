import React from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import { panel } from '../Styles';

StartPanel.propTypes = {
  onStartClick: PropTypes.func.isRequired
};

export default function StartPanel({ onStartClick }) {
  return (
    <div className={panel} style={{ padding: '2rem' }}>
      <h2 style={{ textAlign: 'center' }}>Need help?</h2>
      <div
        style={{
          display: 'flex',
          marginTop: '2rem',
          justifyContent: 'center'
        }}
      >
        <Button
          style={{ marginLeft: '1rem', fontSize: '2rem' }}
          color="rose"
          skeuomorphic
          onClick={onStartClick}
        >
          Start Tutorial
        </Button>
      </div>
    </div>
  );
}
