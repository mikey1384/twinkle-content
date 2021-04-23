import React from 'react';
import PropTypes from 'prop-types';
import { borderRadius } from 'constants/css';
import { css } from '@emotion/css';
import MissionItem from './MissionItem';

MultiMission.propTypes = {
  mission: PropTypes.object.isRequired
};

export default function MultiMission({ mission }) {
  console.log(mission);
  return (
    <div
      className={css`
        margin-top: 2rem;
        border-radius: ${borderRadius};
        margin-bottom: -1rem;
      `}
    >
      <MissionItem
        mission={{
          title: 'something mission',
          id: 1,
          subtitle: 'hello',
          missionType: 'twinkle-website-features'
        }}
      />
      <MissionItem
        style={{ marginTop: '1rem' }}
        mission={{
          title: 'something mission',
          id: 2,
          subtitle: 'hello',
          missionType: 'twinkle-website-features'
        }}
      />
      <MissionItem
        style={{ marginTop: '1rem' }}
        mission={{
          title: 'something mission',
          id: 3,
          subtitle: 'hello',
          missionType: 'twinkle-website-features'
        }}
      />
    </div>
  );
}
