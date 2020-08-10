import React from 'react';
import { css } from 'emotion';
import { addCommasToNumber } from 'helpers/stringHelpers';
import { borderRadius, Color } from 'constants/css';

export default function Store() {
  return (
    <div>
      <div
        className={css`
          background: #fff;
          padding: 1rem;
          border: 1px solid ${Color.borderGray()};
          border-radius: ${borderRadius};
        `}
      >
        <p
          className={css`
            font-size: 2rem;
          `}
        >
          Your Karma Points: {addCommasToNumber(1000)}
        </p>
      </div>
    </div>
  );
}
