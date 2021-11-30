import React, { useEffect, useRef, useMemo, useState } from 'react';
import { css } from '@emotion/css';
import { borderRadius, Color, mobileMaxWidth } from 'constants/css';
import { addCommasToNumber } from 'helpers/stringHelpers';
import { useMyState } from 'helpers/hooks';
import { useAppContext, useContentContext } from 'contexts';
import { karmaMultiplier } from 'constants/defaultValues';
import Loading from 'components/Loading';
import localize from 'constants/localize';

const selectedLanguage = process.env.REACT_APP_SELECTED_LANGUAGE;
const karmaCalculationLabel =
  selectedLanguage === 'en' ? (
    <>
      Your Karma Points = Total number of Twinkles you{' '}
      <b style={{ color: Color.pink() }}>rewarded</b> + (
      {karmaMultiplier.recommendation} × total number of your{' '}
      <b style={{ color: Color.brownOrange() }}>recommendations</b> that were
      approved by teachers)
    </>
  ) : (
    <>
      회원님의 카마포인트 = 회원님이 포상한{' '}
      <b style={{ color: Color.pink() }}>트윈클 개수</b> + (
      {karmaMultiplier.recommendation} × 선생님 유저들이 승인한 회원님의{' '}
      <b style={{ color: Color.brownOrange() }}>추천 개수</b>)
    </>
  );
const rewardedTwinklesLabel =
  selectedLanguage === 'en' ? (
    <>
      Total number of Twinkles you{' '}
      <b style={{ color: Color.pink() }}>rewarded</b>
    </>
  ) : (
    <>
      회원님이 포상한 <b style={{ color: Color.pink() }}>트윈클 개수</b>
    </>
  );

const approvedRecommendationsLabel =
  selectedLanguage === 'en' ? (
    <>
      Total number of{' '}
      <b style={{ color: Color.brownOrange() }}>recommendations</b> approved by
      teachers
    </>
  ) : (
    <>
      선생님 유저들이 승인한 회원님의{' '}
      <b style={{ color: Color.brownOrange() }}>추천 개수</b>
    </>
  );

const karmaPointsLabel = localize('karmaPoints');

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
      return <span>{karmaCalculationLabel}</span>;
    }
    if (selectedLanguage === 'en') {
      <span>
        Your Karma Points = Total number of <b>posts</b> you rewarded ×{' '}
        {karmaMultiplier.post}
      </span>;
    }
    return (
      <span>
        회원님의 카마포인트 = 회원님이 포상한 <b>게시물</b>의 총 개수 ×{' '}
        {karmaMultiplier.post}
      </span>
    );
  }, [authLevel]);

  const calculationText = useMemo(() => {
    if (authLevel < 2) {
      return (
        <div style={{ fontSize: '1.5rem', marginTop: '3rem' }}>
          <p>
            {rewardedTwinklesLabel}: {addCommasToNumber(numTwinklesRewarded)}
          </p>
          <p>
            {approvedRecommendationsLabel}:{' '}
            {addCommasToNumber(numApprovedRecommendations)}
          </p>
          <p style={{ marginTop: '1rem', fontSize: '1.7rem' }}>
            {numTwinklesRewarded} + ({karmaMultiplier.recommendation} ×{' '}
            {numApprovedRecommendations}) ={' '}
            <b style={{ color: Color.darkerGray() }}>
              {addCommasToNumber(karmaPoints)} {karmaPointsLabel}
            </b>
          </p>
        </div>
      );
    }
    if (selectedLanguage === 'en') {
      return (
        <div style={{ fontSize: '1.5rem', marginTop: '3rem' }}>
          <p>
            Total number of posts you rewarded:{' '}
            {addCommasToNumber(numPostsRewarded)}
          </p>
          <p style={{ marginTop: '1rem', fontSize: '1.7rem' }}>
            {numPostsRewarded} × {karmaMultiplier.post} ={' '}
            <b>
              {addCommasToNumber(karmaPoints)} {karmaPointsLabel}
            </b>
          </p>
        </div>
      );
    }
    return (
      <div style={{ fontSize: '1.5rem', marginTop: '3rem' }}>
        <p>
          회원님이 포상한 게시물의 총 개수:{' '}
          {addCommasToNumber(numPostsRewarded)}
        </p>
        <p style={{ marginTop: '1rem', fontSize: '1.7rem' }}>
          {numPostsRewarded} × {karmaMultiplier.post} ={' '}
          <b>
            {addCommasToNumber(karmaPoints)} {karmaPointsLabel}
          </b>
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
