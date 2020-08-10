import React from 'react';
import Icon from 'components/Icon';
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
            font-weight: bold;
            font-size: 2.3rem;
          `}
        >
          Your Karma Points: {addCommasToNumber(1000)}
        </p>
      </div>
      <div
        className={css`
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: 1rem;
          font-size: 2rem;
          background: #fff;
          padding: 1rem;
          border: 1px solid ${Color.borderGray()};
          border-radius: ${borderRadius};
        `}
      >
        <Icon
          style={{ fontSize: '8rem', marginTop: '1rem' }}
          icon="shopping-bag"
        />
        <p style={{ marginTop: '2rem' }}>
          Twinkle Store is currently under construction and will become
          available later this year
        </p>
      </div>
    </div>
  );
}
