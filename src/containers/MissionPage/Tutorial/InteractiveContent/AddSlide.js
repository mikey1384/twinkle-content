import React from 'react';
import Button from 'components/Button';
import Icon from 'components/Icon';
import { borderRadius, Color } from 'constants/css';

export default function AddSlide() {
  return (
    <div
      style={{
        borderRadius,
        padding: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        border: `1px solid ${Color.borderGray()}`
      }}
    >
      <div style={{ display: 'flex' }}>
        <Button skeuomorphic>
          <Icon icon="plus" />
          <span style={{ marginLeft: '0.7rem' }}>Slide</span>
        </Button>
        <Button skeuomorphic style={{ marginLeft: '3rem' }}>
          <Icon icon="code-branch" />
          <span style={{ marginLeft: '0.7rem' }}>Fork</span>
        </Button>
      </div>
    </div>
  );
}
