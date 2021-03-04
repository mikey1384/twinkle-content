import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Loading from 'components/Loading';
import NotEnoughKarmaInstructions from './NotEnoughKarmaInstructions';
import EnoughKarmaInstructions from './EnoughKarmaInstructions';
import FinalStep from './FinalStep';
import { karmaMultiplier, karmaPointTable } from 'constants/defaultValues';
import { useAppContext, useContentContext, useViewContext } from 'contexts';
import { useMyState } from 'helpers/hooks';

TwinkleStore.propTypes = {
  mission: PropTypes.object
};

export default function TwinkleStore({ mission }) {
  const {
    authLevel,
    canChangeUsername,
    userId,
    karmaPoints,
    profileTheme
  } = useMyState();
  const {
    requestHelpers: { loadKarmaPoints, loadMyData }
  } = useAppContext();
  const {
    state: { pageVisible }
  } = useViewContext();
  const {
    actions: { onInitContent, onUpdateProfileInfo }
  } = useContentContext();
  const [loadingKarma, setLoadingKarma] = useState(false);
  const mounted = useRef(true);
  const requiredKarmaPoints = karmaPointTable.username;
  const unlockProgress = useMemo(() => {
    return Math.floor(Math.min((karmaPoints * 100) / requiredKarmaPoints, 100));
  }, [karmaPoints, requiredKarmaPoints]);

  useEffect(() => {
    if (userId) {
      init();
    }

    async function init() {
      if (mounted.current) {
        setLoadingKarma(true);
      }
      const data = await loadMyData();
      if (mounted.current) {
        onInitContent({ contentType: 'user', contentId: data.userId, ...data });
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
  }, [userId, pageVisible]);

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
  ) : canChangeUsername ? (
    <FinalStep mission={mission} userId={userId} />
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
          <EnoughKarmaInstructions requiredKarmaPoints={requiredKarmaPoints} />
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
