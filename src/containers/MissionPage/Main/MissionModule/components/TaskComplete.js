import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Color } from 'constants/css';
import { useAppContext, useMissionContext, useContentContext } from 'contexts';
import { useMyState } from 'helpers/hooks';
import ErrorBoundary from 'components/ErrorBoundary';
import Button from 'components/Button';
import Icon from 'components/Icon';

TaskComplete.propTypes = {
  taskId: PropTypes.number.isRequired,
  emailMissionAttempted: PropTypes.bool
};

export default function TaskComplete({ taskId, emailMissionAttempted }) {
  const { userId } = useMyState();
  const {
    requestHelpers: { uploadMissionAttempt }
  } = useAppContext();
  const {
    actions: { onUpdateMissionAttempt }
  } = useMissionContext();
  const {
    actions: { onChangeUserXP, onUpdateUserCoins }
  } = useContentContext();
  const [submitDisabled, setSubmitDisabled] = useState(false);
  const passMessage = useMemo(
    () =>
      emailMissionAttempted
        ? 'Congratulations on successfully setting up your own email address!'
        : `It looks like you already have an email address!`,
    [emailMissionAttempted]
  );
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return function onUnmount() {
      mounted.current = false;
    };
  }, []);

  return (
    <ErrorBoundary
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontSize: '1.7rem'
      }}
    >
      <p
        style={{
          fontWeight: 'bold',
          fontSize: '1.8rem',
          marginBottom: '1.5rem'
        }}
      >
        {passMessage}
      </p>
      <p>
        Press the <b style={{ color: Color.brownOrange() }}>button</b> below to
        collect your reward
      </p>
      <Button
        filled
        disabled={submitDisabled}
        style={{ marginTop: '3.5rem', fontSize: '1.7rem' }}
        skeuomorphic
        color="brownOrange"
        onClick={handleTaskComplete}
      >
        <Icon icon="bolt" />
        <span style={{ marginLeft: '1rem' }}>Task Complete</span>
      </Button>
    </ErrorBoundary>
  );

  async function handleTaskComplete() {
    setSubmitDisabled(true);
    const { success, newXpAndRank, newCoins } = await uploadMissionAttempt({
      missionId: taskId,
      attempt: { status: 'pass' }
    });
    if (success) {
      if (newXpAndRank.xp && mounted.current) {
        onChangeUserXP({
          xp: newXpAndRank.xp,
          rank: newXpAndRank.rank,
          userId
        });
      }
      if (newCoins.netCoins && mounted.current) {
        onUpdateUserCoins({ coins: newCoins.netCoins, userId });
      }
      if (mounted.current) {
        onUpdateMissionAttempt({
          missionId: taskId,
          newState: { status: 'pass' }
        });
      }
    }
    if (mounted.current) {
      setSubmitDisabled(false);
    }
  }
}
