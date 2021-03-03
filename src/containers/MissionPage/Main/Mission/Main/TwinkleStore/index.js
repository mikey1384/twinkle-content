import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/Icon';
import Loading from 'components/Loading';
import MockUsernameSection from './MockUsernameSection';
import NotEnoughKarmaInstructions from './NotEnoughKarmaInstructions';
import { karmaMultiplier, karmaPointTable } from 'constants/defaultValues';
import { useAppContext, useContentContext } from 'contexts';
import { Color, mobileMaxWidth } from 'constants/css';
import { useMyState } from 'helpers/hooks';
import { css } from '@emotion/css';

TwinkleStore.propTypes = {
  mission: PropTypes.object.isRequired
};

export default function TwinkleStore({ mission }) {
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
      <p style={{ fontWeight: 'bold', fontSize: '2.3rem' }}>Instructions</p>
      <div
        style={{
          marginTop: '2.5rem',
          display: 'flex',
          width: '100%',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <p>
          <span>If you go to </span>
          <a style={{ fontWeight: 'bold' }} href="/store" target="_blank">
            {mission.title}
          </a>
          <span>{`, you will see a section labeled "change your username"`}</span>
        </p>
        <MockUsernameSection
          className={css`
            margin-top: 2rem;
            width: 60%;
            @media (max-width: ${mobileMaxWidth}) {
              width: 90%;
            }
          `}
          karmaPoints={karmaPoints}
          requiredKarmaPoints={requiredKarmaPoints}
          unlockProgress={unlockProgress}
        />
      </div>
      <div
        style={{
          marginTop: '3rem',
          display: 'flex',
          width: '100%',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <p>
          See the{' '}
          <span
            style={{
              fontWeight: 'bold',
              color: Color.green(hasEnoughKarmaPoints ? 1 : 0.5)
            }}
          >
            <Icon icon="unlock" /> unlock
          </span>{' '}
          button below the <Icon icon="lock" /> <span>icon?</span>
        </p>
        {!hasEnoughKarmaPoints && (
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
