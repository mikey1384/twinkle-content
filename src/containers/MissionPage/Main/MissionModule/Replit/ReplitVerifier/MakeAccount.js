import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import Icon from 'components/Icon';
import { Color } from 'constants/css';
import { css } from '@emotion/css';

MakeAccount.propTypes = {
  accountMade: PropTypes.bool,
  onMakeAccount: PropTypes.func.isRequired
};

export default function MakeAccount({ accountMade, onMakeAccount }) {
  const [okayPressed, setOkayPressed] = useState(false);
  return (
    <div
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
      <p>
        1. Go to{' '}
        <a
          onClick={() => setOkayPressed(true)}
          href="https://replit.com"
          target="_blank"
          rel="noreferrer"
        >
          https://replit.com
        </a>{' '}
        and make a new account.
        {accountMade && (
          <Icon
            style={{ marginLeft: '1rem' }}
            color={Color.green()}
            icon="check"
          />
        )}
      </p>
      {!accountMade && (
        <>
          {!okayPressed && (
            <div>
              <Button
                style={{ marginTop: '2rem' }}
                filled
                color="logoBlue"
                onClick={() => {
                  window.open(`https://replit.com`);
                  setTimeout(() => setOkayPressed(true), 1000);
                }}
              >
                Okay
              </Button>
            </div>
          )}
          {okayPressed && (
            <>
              <p style={{ marginTop: '4.5rem' }}>Did you make an account?</p>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Button
                  style={{ marginTop: '2rem' }}
                  filled
                  color="green"
                  onClick={onMakeAccount}
                >
                  Yes, I made an account
                </Button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
