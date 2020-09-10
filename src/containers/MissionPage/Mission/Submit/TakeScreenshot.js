import React from 'react';
import Button from 'components/Button';

export default function TakeScreenshot() {
  return (
    <div
      style={{ display: 'flex', justifyContent: 'center', marginTop: '5rem' }}
    >
      <Button
        color="darkBlue"
        skeuomorphic
        style={{ fontSize: '2rem' }}
        onClick={() => console.log('clicked')}
      >
        Submit Screenshot
      </Button>
    </div>
  );
}
