import React from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import { css } from '@emotion/css';

CreateNewRepl.propTypes = {
  style: PropTypes.object
};

export default function CreateNewRepl({ style }) {
  return (
    <div
      style={style}
      className={css`
        width: 100%;
        font-size: 1.5rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        > p {
          font-size: 2rem;
          font-weight: bold;
        }
      `}
    >
      <p>2. Create a new Next.js Repl</p>
      <div
        style={{
          marginTop: '2rem',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column'
        }}
      >
        <Button filled color="green" onClick={() => console.log('yes')}>
          I created it
        </Button>
        <Button
          style={{ marginTop: '1rem' }}
          filled
          color="logoBlue"
          onClick={() => console.log('yes')}
        >
          {`I don't understand what I am supposed to do`}
        </Button>
      </div>
    </div>
  );
}
