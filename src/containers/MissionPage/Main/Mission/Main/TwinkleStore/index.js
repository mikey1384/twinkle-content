import React, { useEffect, useMemo, useRef, useState } from 'react';
import Loading from 'components/Loading';
import NotEnoughKarmaInstructions from './NotEnoughKarmaInstructions';
import { karmaMultiplier, karmaPointTable } from 'constants/defaultValues';
import { useAppContext, useContentContext } from 'contexts';
import { mobileMaxWidth } from 'constants/css';
import { useMyState } from 'helpers/hooks';
import { css } from '@emotion/css';

export default function TwinkleStore() {
  const { authLevel, userId, karmaPoints, profileTheme } = useMyState();
  const {
    requestHelpers: { loadKarmaPoints }
  } = useAppContext();
  const {
    actions: { onUpdateProfileInfo }
  } = useContentContext();
  const [loadingKarma, setLoadingKarma] = useState(false);
  const mounted = useRef(true);
  const requiredKarmaPoints = karmaPointTable.username;
  const unlockProgress = useMemo(() => {
    return Math.floor(Math.min((karmaPoints * 100) / requiredKarmaPoints, 100));
  }, [karmaPoints, requiredKarmaPoints]);

  useEffect(() => {
    if (userId) {
      handleLoadKarmaPoints();
    }

    async function handleLoadKarmaPoints() {
      if (mounted.current) {
        setLoadingKarma(true);
      }
      const { karmaPoints: kp, numPostsRewarded } = await loadKarmaPoints();

      if (authLevel < 2) {
        if (mounted.current) {
          onUpdateProfileInfo({ userId, karmaPoints: kp });
        }
      } else {
        if (mounted.current) {
          onUpdateProfileInfo({
            userId,
            karmaPoints: karmaMultiplier.post * numPostsRewarded
          });
        }
      }
      if (mounted.current) {
        setLoadingKarma(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const hasEnoughKarmaPoints = useMemo(() => {
    return karmaPoints >= requiredKarmaPoints;
  }, [karmaPoints, requiredKarmaPoints]);

  useEffect(() => {
    mounted.current = true;
    return function onUnmount() {
      mounted.current = false;
    };
  }, []);

  return loadingKarma ? (
    <Loading />
  ) : (
    <div
      style={{
        width: '100%',
        display: 'flex',
        fontSize: '1.7rem',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      <div
        style={{
          marginTop: '2rem',
          display: 'flex',
          width: '100%',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        {hasEnoughKarmaPoints ? (
          <div
            className={css`
              width: 60%;
              padding: 0 1rem;
              text-align: center;
              @media (max-width: ${mobileMaxWidth}) {
                width: 90%;
              }
            `}
          >
            <p>
              You have successfully earned the {requiredKarmaPoints} karma
              points required to enable the unlock button!
            </p>
            <p style={{ marginTop: '5rem' }}>
              Now go to Twinkle Store, press the button, and
            </p>
            <p>come back here when you are done</p>
          </div>
        ) : (
          <NotEnoughKarmaInstructions
            profileTheme={profileTheme}
            unlockProgress={unlockProgress}
            requiredKarmaPoints={requiredKarmaPoints}
            karmaPoints={karmaPoints}
          />
        )}
      </div>
    </div>
  );
}
