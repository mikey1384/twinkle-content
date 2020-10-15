import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import FileViewer from 'components/FileViewer';
import UsernameText from 'components/Texts/UsernameText';
import Button from 'components/Button';
import Icon from 'components/Icon';
import { borderRadius, Color } from 'constants/css';
import { timeSince } from 'helpers/timeStampHelpers';
import { stringIsEmpty, addCommasToNumber } from 'helpers/stringHelpers';

ApprovedStatus.propTypes = {
  mission: PropTypes.object.isRequired,
  onSetMissionState: PropTypes.func.isRequired,
  style: PropTypes.object
};

export default function ApprovedStatus({ mission, onSetMissionState, style }) {
  const rewardDetails = useMemo(() => {
    return mission.xpReward || mission.coinReward ? (
      <>
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
            <span style={{ color: Color.brownOrange(), fontWeight: 'bold' }}>
              {mission.coinReward}
            </span>{' '}
          </>
        ) : null}
      </>
    ) : null;
  }, [mission.coinReward, mission.xpReward]);

  return (
    <div
      style={{
        width: '100%',
        fontSize: '1.7rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        lineHeight: 2,
        ...style
      }}
    >
      <div
        style={{
          ...(mission.myAttempt.status === 'approved' ||
          mission.myAttempt.status === 'rejected'
            ? {
                borderRadius,
                boxShadow:
                  mission.myAttempt.status === 'approved'
                    ? `0 0 2px ${Color.brown()}`
                    : null,
                padding: '0.5rem 2rem'
              }
            : {}),
          fontWeight: 'bold',
          fontSize: '2rem',
          background:
            mission.myAttempt.status === 'approved'
              ? Color.brownOrange()
              : mission.myAttempt.status === 'rejected'
              ? Color.black()
              : null,
          color: '#fff'
        }}
      >
        {mission.myAttempt.status === 'approved'
          ? 'Mission Accomplished!'
          : 'Mission Failed...'}
      </div>
      {mission.myAttempt.status === 'approved' && (
        <div
          style={{
            marginTop: '0.5rem',
            color: Color.black()
          }}
        >
          You were rewarded {rewardDetails}
          <Icon
            style={{ color: Color.brownOrange(), fontWeight: 'bold' }}
            icon={['far', 'badge-dollar']}
          />
        </div>
      )}
      {mission.myAttempt.filePath && (
        <FileViewer
          style={{ marginTop: '2rem' }}
          thumbUrl={mission.myAttempt.thumbUrl}
          src={mission.myAttempt.filePath}
        />
      )}
      {!stringIsEmpty(mission.myAttempt.feedback) && (
        <div
          style={{
            width: '100%',
            marginTop: '2.5rem',
            padding: '1rem',
            border: `1px solid ${Color.borderGray()}`,
            borderRadius
          }}
        >
          {mission.myAttempt.reviewer && (
            <>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  lineHeight: 1.5
                }}
              >
                <UsernameText
                  color={Color.blue()}
                  user={mission.myAttempt.reviewer}
                />
                <span>{timeSince(mission.myAttempt.reviewTimeStamp)}</span>
              </div>
              <div>
                {mission.myAttempt.feedback ||
                  (mission.myAttempt.status === 'approved'
                    ? 'Great job!'
                    : 'Please try again')}
              </div>
            </>
          )}
        </div>
      )}
      {mission.myAttempt.status === 'rejected' && (
        <div style={{ marginTop: '3rem' }}>
          <Button
            style={{ fontSize: '2.5rem' }}
            color="green"
            onClick={() =>
              onSetMissionState({
                missionId: mission.id,
                newState: { myAttempt: null }
              })
            }
            filled
          >
            Try again
          </Button>
        </div>
      )}
    </div>
  );
}
