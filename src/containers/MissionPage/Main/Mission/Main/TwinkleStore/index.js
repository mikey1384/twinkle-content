import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/Icon';
import Loading from 'components/Loading';
import MockUsernameSection from './MockUsernameSection';
import Button from 'components/Button';
import ProgressBar from 'components/ProgressBar';
import { karmaMultiplier, karmaPointTable } from 'constants/defaultValues';
import { useAppContext, useContentContext } from 'contexts';
import { Color, mobileMaxWidth } from 'constants/css';
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
          marginTop: '20rem',
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
          <div
            style={{
              marginTop: '1rem',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <p>{`Right now that button is faded out and doesn't work`}</p>
            <p style={{ marginTop: '20rem' }}>
              <span>{`This is because you don't have enough karma points`}</span>
            </p>
            <div
              className={css`
                width: 60%;
                padding: 0 1rem;
                @media (max-width: ${mobileMaxWidth}) {
                  width: 90%;
                }
              `}
            >
              <ProgressBar
                style={{ width: '100%', marginTop: '1.5rem' }}
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
            <p style={{ marginTop: '20rem' }}>
              To make the button work, you need to earn{' '}
              <b>{requiredKarmaPoints - karmaPoints} more karma points</b>
            </p>
            <p style={{ marginTop: '1rem' }}>
              Once you do, the button will light up like this
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
                skeuomorphic
                color="green"
                style={{ fontSize: '3rem', padding: '2rem', cursor: 'default' }}
                className={css`
                  &:hover {
                    box-shadow: 0 0 1px ${Color.green(0.5)} !important;
                    border-color: ${Color.green(0.5)}!important;
                  }
                `}
                onClick={() => null}
              >
                <Icon icon="unlock" />
                <span style={{ marginLeft: '0.7rem' }}>Unlock</span>
              </Button>
            </div>
            <p style={{ marginTop: '20rem' }}>
              <span>
                Your <b>mission</b> is to earn the remaining
              </span>{' '}
              {requiredKarmaPoints - karmaPoints} karma points
            </p>
            <p style={{ marginTop: '1rem' }}>
              <span>{` and press the "unlock" button`}</span> from{' '}
              <a href="/store" target="_blank">
                {mission.title}
              </a>{' '}
              once it lights up.
            </p>
            <p style={{ marginTop: '1rem' }}>
              When you are done, come back here to claim your reward!
            </p>
            <p style={{ marginTop: '20rem', fontWeight: 'bold' }}>Good luck!</p>
          </div>
        )}
      </div>
    </div>
  );
}
