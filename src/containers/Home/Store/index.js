import React, { useMemo } from 'react';
import Icon from 'components/Icon';
import { css } from 'emotion';
import { addCommasToNumber } from 'helpers/stringHelpers';
import { borderRadius, Color, mobileMaxWidth } from 'constants/css';
import { useMyState } from 'helpers/hooks';

export default function Store() {
  const { authLevel, userType, userId } = useMyState();

  const instructionText = useMemo(() => {
    if (!authLevel || authLevel < 2) {
      return (
        <span>
          Your Karma Points = Total number of <b>Twinkles</b> you rewarded + (3
          × Total number of <b>Twinkle Coins</b> you earned{' '}
          <b>for recommending posts</b>)
        </span>
      );
    }
    return 'Your Karma Points = Total number of posts you rewarded × 5';
  }, [authLevel]);

  return (
    <div>
      {userId && (
        <div
          className={css`
            background: #fff;
            padding: 1rem;
            border: 1px solid ${Color.borderGray()};
            border-radius: ${borderRadius};
            @media (max-width: ${mobileMaxWidth}) {
              border-radius: 0;
              border-top: 0;
              border-left: 0;
              border-right: 0;
            }
          `}
        >
          <p
            className={css`
              font-weight: bold;
              font-size: 2.3rem;
            `}
          >
            You have {addCommasToNumber(1000)} Karma Points
          </p>
          <div
            className={css`
              margin-top: 2rem;
            `}
          >
            {userType && (
              <p
                className={css`
                  font-size: 2rem;
                  font-weight: bold;
                `}
              >
                {userType}
              </p>
            )}
            <p
              className={css`
                font-size: 1.7rem;
              `}
            >
              {instructionText}
            </p>
          </div>
        </div>
      )}
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
          @media (max-width: ${mobileMaxWidth}) {
            border-radius: 0;
            border-left: 0;
            border-right: 0;
          }
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
