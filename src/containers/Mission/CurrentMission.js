import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import MissionItem from 'components/MissionItem';
import { css } from '@emotion/css';
import { useMissionContext } from 'contexts';

CurrentMission.propTypes = {
  style: PropTypes.object,
  missionId: PropTypes.number
};

export default function CurrentMission({ style, missionId }) {
  const {
    state: { missionObj }
  } = useMissionContext();
  const mission = useMemo(
    () => missionObj[missionId] || {},
    [missionId, missionObj]
  );

  return (
    <div style={style} className="desktop">
      <p
        className={css`
          font-size: 2.5rem;
          font-weight: bold;
        `}
      >
        Current Mission
      </p>
      <MissionItem
        showStatus={false}
        style={{ marginTop: '1rem' }}
        mission={mission}
        missionLink={`/missions/${mission.missionType}`}
      />
    </div>
  );
}
