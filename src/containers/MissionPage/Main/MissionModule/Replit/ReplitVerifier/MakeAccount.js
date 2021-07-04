import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/Icon';
import { Color } from 'constants/css';
import { css } from '@emotion/css';

MakeAccount.propTypes = {
  accountMade: PropTypes.bool,
  okayPressed: PropTypes.bool,
  onSetOkayPressed: PropTypes.func.isRequired
};

export default function MakeAccount({
  accountMade,
  okayPressed,
  onSetOkayPressed
}) {
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
        Go to{' '}
        <a
          onClick={() => onSetOkayPressed(true)}
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
      {okayPressed && (
        <p style={{ marginTop: '4.5rem', marginBottom: '2rem' }}>
          Did you make an account?
        </p>
      )}
    </div>
  );
}
