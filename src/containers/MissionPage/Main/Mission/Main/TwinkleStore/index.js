import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import UnlockFaded from './unlock_faded.png';
import Icon from 'components/Icon';
import Loading from 'components/Loading';
import MockUsernameSection from './MockUsernameSection';
import { karmaMultiplier } from 'constants/defaultValues';
import { useAppContext, useContentContext } from 'contexts';
import { mobileMaxWidth } from 'constants/css';
import { css } from '@emotion/css';
import { useMyState } from 'helpers/hooks';

TwinkleStore.propTypes = {
  mission: PropTypes.object.isRequired
};

export default function TwinkleStore({ mission }) {
  const { authLevel, userId, karmaPoints } = useMyState();
  const {
    requestHelpers: { loadKarmaPoints }
  } = useAppContext();
  const {
    actions: { onUpdateProfileInfo }
  } = useContentContext();
  const [loadingKarma, setLoadingKarma] = useState(false);
  const mounted = useRef(true);

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
          <span>In </span>
          <a href="/store" target="_blank">
            {mission.title}
          </a>
          <span>{`, you will see a section labeled "change your username"`}</span>
        </p>
        <MockUsernameSection
          style={{ marginTop: '3rem' }}
          karmaPoints={karmaPoints}
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
        <img
          className={css`
            width: 100%;
            max-width: 30rem;
            @media (max-width: ${mobileMaxWidth}) {
              max-width: 50%;
            }
          `}
          src={UnlockFaded}
        />
      </div>
    </div>
  );
}
