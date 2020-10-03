import React from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import { panel } from '../Styles';

ViewTutorial.propTypes = {
  userCanEdit: PropTypes.bool,
  onStartClick: PropTypes.func.isRequired
};

export default function ViewTutorial({ userCanEdit, onStartClick }) {
  return (
    <div className={panel} style={{ padding: '2rem', width: '100%' }}>
      {!userCanEdit && (
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>
          Need help?
        </h2>
      )}
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
          {userCanEdit ? 'Edit Tutorial' : 'Start Tutorial'}
        </Button>
      </div>
    </div>
  );
}
