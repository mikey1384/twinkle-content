import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import Icon from 'components/Icon';
import { Color, mobileMaxWidth } from 'constants/css';
import { css } from '@emotion/css';

CreateNewRepl.propTypes = {
  style: PropTypes.object
};

export default function CreateNewRepl({ style }) {
  const [helpButtonPressed, setHelpButtonPressed] = useState(false);
  return (
    <div
      style={style}
      className={css`
        width: 100%;
        font-size: 1.7rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        > p {
          font-size: 2rem;
          font-weight: bold;
        }
        @media (max-width: ${mobileMaxWidth}) {
          font-size: 1.5rem;
        }
      `}
    >
      <p>2. Great job! Now, create a Next.js Repl</p>
      <div
        style={{
          marginTop: '2.5rem',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column'
        }}
      >
        <Button filled color="green" onClick={() => console.log('yes')}>
          I created it
        </Button>
        {!helpButtonPressed && (
          <Button
            style={{ marginTop: '1rem' }}
            filled
            color="logoBlue"
            onClick={() => setHelpButtonPressed(true)}
          >
            {`I don't understand what I am supposed to do`}
          </Button>
        )}
        {helpButtonPressed && (
          <div style={{ marginTop: '3rem', marginBottom: '-1rem' }}>
            Read the <b style={{ color: Color.green() }}>tutorial</b> below{' '}
            <Icon icon="arrow-down" /> to learn how to create a Next.js Repl
          </div>
        )}
      </div>
    </div>
  );
}
