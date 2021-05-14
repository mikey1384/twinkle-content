import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import Icon from 'components/Icon';
import { Color, mobileMaxWidth } from 'constants/css';
import { css } from '@emotion/css';

CreateNewRepl.propTypes = {
  replCreated: PropTypes.bool.isRequired,
  onCreateRepl: PropTypes.func.isRequired,
  style: PropTypes.object
};

export default function CreateNewRepl({ replCreated, onCreateRepl, style }) {
  const [helpButtonPressed, setHelpButtonPressed] = useState(false);
  const [okayPressed, setOkayPressed] = useState(false);

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
      <p>
        2.{' '}
        {replCreated
          ? 'Create a Next.js Repl'
          : `Great job! Now, create a Next.js Repl`}
        {replCreated && (
          <Icon
            style={{ marginLeft: '1rem' }}
            color={Color.green()}
            icon="check"
          />
        )}
      </p>
      {!replCreated && (
        <>
          <div
            style={{
              marginTop: '2.5rem',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column'
            }}
          >
            {!okayPressed && (
              <Button
                filled
                color="logoBlue"
                onClick={() => setOkayPressed(true)}
              >
                Okay
              </Button>
            )}
          </div>
          {okayPressed && (
            <>
              <p style={{ marginTop: '4.5rem' }}>
                Did you create a Next.js Repl?
              </p>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Button
                  style={{ marginTop: '2rem' }}
                  filled
                  color="green"
                  onClick={onCreateRepl}
                >
                  Yes, I did
                </Button>
              </div>
            </>
          )}
          {!helpButtonPressed && (
            <Button
              style={{ marginTop: '3rem' }}
              filled
              color="cranberry"
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
        </>
      )}
    </div>
  );
}
