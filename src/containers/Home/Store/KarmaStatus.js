import React, { useEffect, useRef, useMemo, useState } from 'react';
import { css } from '@emotion/css';
import { borderRadius, Color, mobileMaxWidth } from 'constants/css';
import { addCommasToNumber } from 'helpers/stringHelpers';
import { useMyState } from 'helpers/hooks';
import { useAppContext, useContentContext } from 'contexts';
import { karmaMultiplier } from 'constants/defaultValues';
import Loading from 'components/Loading';

const selectedLanguage = process.env.REACT_APP_SELECTED_LANGUAGE;

export default function KarmaStatus() {
  const {
    requestHelpers: { loadKarmaPoints }
  } = useAppContext();
  const {
    actions: { onUpdateProfileInfo }
  } = useContentContext();
  const mounted = useRef(true);
  const { authLevel, userType, userId, karmaPoints } = useMyState();
  const [loadingKarma, setLoadingKarma] = useState(false);
  const [numTwinklesRewarded, setNumTwinklesRewarded] = useState(0);
  const [numApprovedRecommendations, setNumApprovedRecommendations] =
    useState(0);
  const [numPostsRewarded, setNumPostsRewarded] = useState(0);
  useEffect(() => {
    mounted.current = true;
    return function cleanUp() {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (userId) {
      handleLoadKarmaPoints();
    }

    async function handleLoadKarmaPoints() {
      if (mounted.current) {
        setLoadingKarma(true);
      }
      const {
        karmaPoints: kp,
        numTwinklesRewarded,
        numApprovedRecommendations,
        numPostsRewarded
      } = await loadKarmaPoints();
      if (mounted.current) {
        onUpdateProfileInfo({ userId, karmaPoints: kp });
      }
      if (authLevel < 2) {
        if (mounted.current) {
          setNumTwinklesRewarded(numTwinklesRewarded);
        }
        if (mounted.current) {
          setNumApprovedRecommendations(numApprovedRecommendations);
        }
      } else {
        if (mounted.current) {
          setNumPostsRewarded(numPostsRewarded);
        }
      }
      if (mounted.current) {
        setLoadingKarma(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const instructionText = useMemo(() => {
    if (authLevel < 2) {
      return (
        <span>
          Your Karma Points = Total number of Twinkles you{' '}
          <b style={{ color: Color.pink() }}>rewarded</b> + (
          {karmaMultiplier.recommendation} × total number of your{' '}
          <b style={{ color: Color.brownOrange() }}>recommendations</b> that
          were approved by teachers)
        </span>
      );
    }
    return (
      <span>
        Your Karma Points = Total number of <b>posts</b> you rewarded ×{' '}
        {karmaMultiplier.post}
      </span>
    );
  }, [authLevel]);

  const calculationText = useMemo(() => {
    if (authLevel < 2) {
      return (
        <div style={{ fontSize: '1.5rem', marginTop: '3rem' }}>
          <p>
            Total number of Twinkles you{' '}
            <b style={{ color: Color.pink() }}>rewarded</b>:{' '}
            {addCommasToNumber(numTwinklesRewarded)}
          </p>
          <p>
            Total number of{' '}
            <b style={{ color: Color.brownOrange() }}>recommendations</b>{' '}
            approved by teachers:{' '}
            {addCommasToNumber(numApprovedRecommendations)}
          </p>
          <p style={{ marginTop: '1rem', fontSize: '1.7rem' }}>
            {numTwinklesRewarded} + ({karmaMultiplier.recommendation} ×{' '}
            {numApprovedRecommendations}) ={' '}
            <b style={{ color: Color.darkerGray() }}>
              {addCommasToNumber(karmaPoints)} Karma Points
            </b>
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
          {numPostsRewarded} × {karmaMultiplier.post} ={' '}
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

  const youHaveKarmaPointsText = useMemo(() => {
    return selectedLanguage === 'en'
      ? `You have ${addCommasToNumber(karmaPoints)} Karma Points`
      : `회원님의 카마포인트는 ${addCommasToNumber(karmaPoints)}점입니다`;
  }, [karmaPoints]);

  if (!userId) return null;

  return (
    <div
      className={css`
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
      {loadingKarma ? (
        <Loading style={{ height: '10rem' }} />
      ) : (
        <>
          <p
            className={css`
              font-weight: bold;
              font-size: 2.2rem;
              color: ${Color.darkerGray()};
            `}
          >
            {youHaveKarmaPointsText}
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
  );
}
