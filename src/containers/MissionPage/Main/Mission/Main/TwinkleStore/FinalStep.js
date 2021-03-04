import React from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import { css } from '@emotion/css';

FinalStep.propTypes = {
  style: PropTypes.object
};

export default function FinalStep({ style }) {
  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontSize: '1.7rem',
        ...style
      }}
      className={css`
        > p {
          line-height: 2;
        }
      `}
    >
      <p>Great! You have unlocked change username item from Twinkle Store!</p>
      <p>Press this button to claim your reward</p>
      <Button
        style={{ marginTop: '2rem', fontSize: '1.7rem' }}
        skeuomorphic
        color="green"
      >
        Press it
      </Button>
    </div>
  );
}
