import React from 'react';
import Button from 'components/Button';

export default function FinalStep() {
  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      <p>Great! You have unlocked change username item from Twinkle Store!</p>
      <p>Press this button to claim your reward</p>
      <Button skeuomorphic color="green">
        Press it
      </Button>
    </div>
  );
}
