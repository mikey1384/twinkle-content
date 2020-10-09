import React from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import Icon from 'components/Icon';
import { panel } from '../../Styles';

ViewTutorial.propTypes = {
  onStartClick: PropTypes.func.isRequired
};

export default function ViewTutorial({ onStartClick }) {
  return (
    <div className={panel} style={{ padding: '2rem', width: '100%' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Need help?</h2>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <Button
          style={{ marginLeft: '1rem', fontSize: '2rem' }}
          color="rose"
          skeuomorphic
          onClick={onStartClick}
        >
          <Icon icon="chalkboard-teacher" />
          <span style={{ marginLeft: '1rem' }}>Start Tutorial</span>
        </Button>
      </div>
    </div>
  );
}
