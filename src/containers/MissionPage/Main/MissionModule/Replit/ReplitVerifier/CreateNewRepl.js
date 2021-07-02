import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/Icon';
import { Color, mobileMaxWidth } from 'constants/css';
import { css } from '@emotion/css';

CreateNewRepl.propTypes = {
  okayPressed: PropTypes.bool,
  replCreated: PropTypes.bool.isRequired,
  style: PropTypes.object
};

export default function CreateNewRepl({ okayPressed, replCreated, style }) {
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
        2. Create a Next.js Repl
        {replCreated && (
          <Icon
            style={{ marginLeft: '1rem' }}
            color={Color.green()}
            icon="check"
          />
        )}
      </p>
      {okayPressed && (
        <p style={{ marginTop: '4.5rem', marginBottom: '2rem' }}>
          Did you create a Next.js Repl?
        </p>
      )}
    </div>
  );
}
