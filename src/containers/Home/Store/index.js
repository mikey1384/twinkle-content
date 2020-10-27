import React, { useEffect, useMemo, useRef, useState } from 'react';
import Icon from 'components/Icon';
import Loading from 'components/Loading';
import { css } from 'emotion';
import { addCommasToNumber } from 'helpers/stringHelpers';
import { borderRadius, Color, mobileMaxWidth } from 'constants/css';
import { useMyState } from 'helpers/hooks';
import { useAppContext } from 'contexts';

export default function Store() {
  const {
    requestHelpers: { loadKarmaPoints }
  } = useAppContext();
  const mounted = useRef(true);
  const { authLevel, userType, userId } = useMyState();
  const [loadingKarma, setLoadingKarma] = useState(false);
  const [karmaPoints, setKarmaPoints] = useState(0);
  const [numTwinklesRewarded, setNumTwinklesRewarded] = useState(0);
  const [numApprovedRecommendations, setNumApprovedRecommendations] = useState(
    0
  );
  const [numPostsRewarded, setNumPostsRewarded] = useState(0);
  const recommendationsMultiplier = 10;
  const postsMultiplier = 3;

  useEffect(() => {
    return function cleanUp() {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (userId) {
      handleLoadKarmaPoints();
    }

    async function handleLoadKarmaPoints() {
      setLoadingKarma(true);
      const {
        numTwinklesRewarded,
        numApprovedRecommendations,
        numPostsRewarded
      } = await loadKarmaPoints();
      if (mounted.current) {
        if (authLevel < 2) {
          setKarmaPoints(
            numTwinklesRewarded +
              recommendationsMultiplier * numApprovedRecommendations
          );
          setNumTwinklesRewarded(numTwinklesRewarded);
          setNumApprovedRecommendations(numApprovedRecommendations);
        } else {
          setKarmaPoints(postsMultiplier * numPostsRewarded);
          setNumPostsRewarded(numPostsRewarded);
        }
        setLoadingKarma(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const instructionText = useMemo(() => {
    if (authLevel < 2) {
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

  const calculationText = useMemo(() => {
    if (authLevel < 2) {
      return (
        <div style={{ fontSize: '1.5rem', marginTop: '3rem' }}>
          <p>
            Total number of <b style={{ color: Color.pink() }}>Twinkles</b> you
            rewarded: {addCommasToNumber(numTwinklesRewarded)}
          </p>
          <p>
            Total number of{' '}
            <b style={{ color: Color.brownOrange() }}>recommendations</b>{' '}
            approved by teachers:{' '}
            {addCommasToNumber(numApprovedRecommendations)}
          </p>
          <p style={{ marginTop: '1rem', fontSize: '1.7rem' }}>
            {numTwinklesRewarded} + ({recommendationsMultiplier} ×{' '}
            {numApprovedRecommendations}) ={' '}
            <b>{addCommasToNumber(karmaPoints)} Karma Points</b>
          </p>
        </div>
      );
    }
    return (
      <div style={{ fontSize: '1.5rem', marginTop: '3rem' }}>
        <p>
          Total number of posts you rewarded:{' '}
          {addCommasToNumber(numPostsRewarded)}
        </p>
        <p style={{ marginTop: '1rem', fontSize: '1.7rem' }}>
          {numPostsRewarded} × {postsMultiplier} ={' '}
          <b>{addCommasToNumber(karmaPoints)} Karma Points</b>
        </p>
      </div>
    );
  }, [
    authLevel,
    karmaPoints,
    numApprovedRecommendations,
    numPostsRewarded,
    numTwinklesRewarded
  ]);

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
          {loadingKarma ? (
            <Loading style={{ height: '10rem' }} />
          ) : (
            <>
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
                <div>{calculationText}</div>
              </div>
            </>
          )}
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
          Twinkle Store will open later this year
        </p>
      </div>
    </div>
  );
}
