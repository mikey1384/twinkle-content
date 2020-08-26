import React from 'react';
import Button from 'components/Button';
import { panel } from '../Styles';

export default function StartPanel() {
  return (
    <div className={panel}>
      <h2>Need help?</h2>
      <div
        style={{
          display: 'flex',
          marginTop: '3rem',
          justifyContent: 'center'
        }}
      >
        <Button
          style={{ marginLeft: '1rem', fontSize: '2rem' }}
          color="rose"
          skeuomorphic
        >
          Start Tutorial
        </Button>
      </div>
    </div>
  );
}
