import React from 'react';
import Button from 'components/Button';

export default function FinalStep() {
  return (
    <div>
      Great! You have unlocked change username item from Twinkle Store!
      <div>
        Press this button to claim your reward
        <Button skeuomorphic color="green">
          Press it
        </Button>
      </div>
    </div>
  );
}
