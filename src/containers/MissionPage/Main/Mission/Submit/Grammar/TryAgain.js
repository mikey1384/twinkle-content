import React from 'react';
import PropTypes from 'prop-types';
import { Color, borderRadius } from 'constants/css';
import Button from 'components/Button';

TryAgain.propTypes = {
  onTryAgain: PropTypes.func.isRequired
};

export default function TryAgain({ onTryAgain }) {
  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        fontSize: '2rem',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column'
      }}
    >
      <div
        style={{
          borderRadius,
          marginTop: '2.5rem',
          boxShadow: `0 0 2px ${Color.brown()}`,
          padding: '1rem 3rem',
          fontWeight: 'bold',
          fontSize: '2rem',
          background: Color.black(),
          color: '#fff'
        }}
      >
        Mission Failed...
      </div>
      <div
        style={{ marginTop: '1.5rem', fontSize: '1.5rem' }}
      >{`Don't give up! You can do this`}</div>
      <div style={{ marginTop: '5rem' }}>
        <Button
          style={{ fontSize: '2.3rem' }}
          color="green"
          onClick={() => onTryAgain()}
          filled
        >
          Try again
        </Button>
      </div>
    </div>
  );
}
