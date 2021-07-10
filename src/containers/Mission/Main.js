import React from 'react';
import PropTypes from 'prop-types';
import CurrentMission from './CurrentMission';
import MissionList from './MissionList';
import RepeatableMissions from './RepeatableMissions';
import { mobileMaxWidth } from 'constants/css';
import { css } from '@emotion/css';

Main.propTypes = {
  className: PropTypes.string,
  currentMissionId: PropTypes.number,
  missions: PropTypes.array,
  missionObj: PropTypes.object,
  myAttempts: PropTypes.object,
  userId: PropTypes.number
};

export default function Main({
  className,
  currentMissionId,
  missions,
  missionObj,
  myAttempts,
  userId
}) {
  return (
    <div className={className}>
      <div
        className={css`
          width: CALC(100% - 5rem);
          margin-left: 5rem;
          display: flex;
          @media (max-width: ${mobileMaxWidth}) {
            width: CALC(100% - 2rem);
            margin-top: 1.5rem;
            margin-left: 1rem;
            flex-direction: column;
          }
        `}
      >
        <MissionList
          missions={missions}
          missionObj={missionObj}
          className={css`
            width: CALC(${missionObj[currentMissionId] ? '65%' : '80%'} - 5rem);
            @media (max-width: ${mobileMaxWidth}) {
              width: 100%;
            }
          `}
        />
        {missionObj[currentMissionId] && (
          <div
            className={css`
              width: CALC(35% - 5rem);
              margin-left: 5rem;
              @media (max-width: ${mobileMaxWidth}) {
                margin-left: 0;
                margin-top: 3rem;
                width: 100%;
              }
            `}
          >
            <CurrentMission
              mission={missionObj[currentMissionId]}
              missionId={currentMissionId}
              style={{ width: '100%' }}
            />
            {userId && (
              <RepeatableMissions
                className={css`
                  margin-top: 2rem;
                  @media (max-width: ${mobileMaxWidth}) {
                    margin-top: 0;
                  }
                `}
                myAttempts={myAttempts}
                missions={missions}
                missionObj={missionObj}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
