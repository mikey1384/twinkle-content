import React from 'react';
import PropTypes from 'prop-types';
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
      <p>2. Create a new Repl</p>
    </div>
  );
}
