import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/Icon';
import Loading from 'components/Loading';
import MockUsernameSection from './MockUsernameSection';
import Button from 'components/Button';
import ProgressBar from 'components/ProgressBar';
import { karmaMultiplier, karmaPointTable } from 'constants/defaultValues';
import { useAppContext, useContentContext } from 'contexts';
import { Color } from 'constants/css';
import { addCommasToNumber } from 'helpers/stringHelpers';
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
          <a href="/store" target="_blank">
            {mission.title}
          </a>
          <span>{`, you will see a section labeled "change your username"`}</span>
        </p>
        <MockUsernameSection
          style={{ marginTop: '2rem' }}
          karmaPoints={karmaPoints}
          requiredKarmaPoints={requiredKarmaPoints}
          unlockProgress={unlockProgress}
        />
      </div>
      <div
        style={{
          marginTop: '5rem',
          display: 'flex',
          width: '100%',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <p>
          <span>{`See the button that says "unlock" below the`}</span>{' '}
          <Icon icon="lock" /> <span>icon?</span>
        </p>
        <div
          className={css`
            display: flex;
            justify-content: center;
            width: 100%;
            margin-top: 1rem;
          `}
        >
          <Button
            disabled={!hasEnoughKarmaPoints}
            skeuomorphic
            color="green"
            style={{ fontSize: '3rem', padding: '2rem' }}
            onClick={() => null}
          >
            <Icon icon="unlock" />
            <span style={{ marginLeft: '0.7rem' }}>Unlock</span>
          </Button>
        </div>
        {!hasEnoughKarmaPoints && (
          <div style={{ marginTop: '1rem' }}>
            <div>{`Right now the button is faded out and doesn't work`}</div>
            <ProgressBar
              color={
                unlockProgress === 100 ? Color.green() : Color[profileTheme]()
              }
              progress={unlockProgress}
            />
            <p style={{ fontSize: '1.2rem', marginTop: '0.5rem' }}>
              You need{' '}
              <b>{addCommasToNumber(requiredKarmaPoints)} karma points</b> to
              unlock this item. You have{' '}
              <b>{addCommasToNumber(karmaPoints)} karma points</b>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
