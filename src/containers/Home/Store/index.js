import React, { useEffect, useMemo, useState } from 'react';
import Icon from 'components/Icon';
import { css } from 'emotion';
import { addCommasToNumber } from 'helpers/stringHelpers';
import { borderRadius, Color, mobileMaxWidth } from 'constants/css';
import { useMyState } from 'helpers/hooks';
import { useAppContext } from 'contexts';

export default function Store() {
  const {
    requestHelpers: { loadKarmaPoints }
  } = useAppContext();
  const { authLevel, userType, userId } = useMyState();
  const [karmaPoints, setKarmaPoints] = useState(0);
  const recommendationsMultiplier = 10;
  const postsMultiplier = 5;

  useEffect(() => {
    if (userId) {
      handleLoadKarmaPoints();
    }

    async function handleLoadKarmaPoints() {
      const {
        numTwinklesRewarded,
        numApprovedRecommendations,
        numPostsRewarded
      } = await loadKarmaPoints();
      if (!authLevel || authLevel < 2) {
        setKarmaPoints(
          numTwinklesRewarded +
            recommendationsMultiplier * numApprovedRecommendations
        );
      } else {
        setKarmaPoints(postsMultiplier * numPostsRewarded);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const instructionText = useMemo(() => {
    if (!authLevel || authLevel < 2) {
      return (
        <span>
          Your Karma Points = Total number of{' '}
          <b style={{ color: Color.pink() }}>Twinkles</b> you rewarded + (
          {recommendationsMultiplier} × total number of your{' '}
          <b style={{ color: Color.brownOrange() }}>recommendations</b> that
          were approved by teachers)
        </span>
      );
    }
    return (
      <span>
        Your Karma Points = Total number of <b>posts</b> you rewarded ×{' '}
        {postsMultiplier}
      </span>
    );
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
            You have {addCommasToNumber(karmaPoints)} Karma Points
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
