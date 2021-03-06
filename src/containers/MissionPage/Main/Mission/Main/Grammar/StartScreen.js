import React, { useLayoutEffect, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import Icon from 'components/Icon';
import { addCommasToNumber } from 'helpers/stringHelpers';
import { borderRadius, Color } from 'constants/css';

StartScreen.propTypes = {
  isRepeating: PropTypes.bool,
  mission: PropTypes.object.isRequired,
  onInitMission: PropTypes.func.isRequired,
  onStartButtonClick: PropTypes.func.isRequired
};

export default function StartScreen({
  isRepeating,
  mission,
  onInitMission,
  onStartButtonClick
}) {
  const BodyRef = useRef(document.scrollingElement || document.documentElement);
  useLayoutEffect(() => {
    document.getElementById('App').scrollTop = 0;
    BodyRef.current.scrollTop = 0;
    onInitMission();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rewardDetails = useMemo(() => {
    return (mission.xpReward || mission.coinReward) &&
      mission.myAttempt.status === 'pass' ? (
      <div
        style={{
          marginTop: '0.5rem',
          color: Color.black()
        }}
      >
        You were rewarded{' '}
        {mission.xpReward ? (
          <span style={{ color: Color.logoGreen(), fontWeight: 'bold' }}>
            {addCommasToNumber(mission.xpReward)}{' '}
          </span>
        ) : null}
        {mission.xpReward && mission.coinReward ? (
          <>
            <span style={{ color: Color.gold(), fontWeight: 'bold' }}>XP</span>{' '}
            and{' '}
          </>
        ) : null}
        {mission.coinReward ? (
          <>
            <Icon
              style={{ color: Color.brownOrange(), fontWeight: 'bold' }}
              icon={['far', 'badge-dollar']}
            />{' '}
            <span style={{ color: Color.brownOrange(), fontWeight: 'bold' }}>
              {mission.coinReward}
            </span>
          </>
        ) : null}
      </div>
    ) : null;
  }, [mission.coinReward, mission.myAttempt.status, mission.xpReward]);

  return (
    <div
      style={{
        textAlign: 'center',
        width: '100%',
        marginTop: '2.5rem'
      }}
    >
      {isRepeating && (
        <div
          style={{
            marginTop: '-1rem',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            justifyContent: 'center',
            marginBottom: '3.5rem'
          }}
        >
          <div
            style={{
              borderRadius,
              width: 'auto',
              boxShadow: `0 0 2px ${Color.brown()}`,
              padding: '0.5rem 2rem',
              fontWeight: 'bold',
              fontSize: '2rem',
              background: Color.brownOrange(),
              color: '#fff'
            }}
          >
            Mission Accomplished
          </div>
          <div style={{ fontSize: '1.3rem' }}>{rewardDetails}</div>
          <div
            style={{
              fontSize: '1.5rem',
              marginTop: '1rem',
              fontWeight: 'bold',
              color: Color.green()
            }}
          >
            This mission is repeatable
          </div>
        </div>
      )}
      <h3>Correctly answer all {mission.numQuestions} grammar questions</h3>
      <p
        style={{ marginTop: '1.5rem', fontSize: '1.7rem' }}
      >{`When you are ready, press "Start"`}</p>
      <div
        style={{
          display: 'flex',
          marginTop: '3.5rem',
          justifyContent: 'center'
        }}
      >
        <Button
          color="green"
          filled
          style={{ fontSize: '2.3rem' }}
          onClick={onStartButtonClick}
        >
          Start
        </Button>
      </div>
    </div>
  );
}
