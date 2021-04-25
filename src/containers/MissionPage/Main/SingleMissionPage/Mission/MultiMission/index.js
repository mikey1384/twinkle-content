import React from 'react';
import PropTypes from 'prop-types';
import { borderRadius } from 'constants/css';
import { css } from '@emotion/css';
import MissionItem from './MissionItem';

MultiMission.propTypes = {
  mission: PropTypes.object.isRequired
};

export default function MultiMission({ mission: { levels } }) {
  return (
    <div
      className={css`
        margin-top: 2rem;
        border-radius: ${borderRadius};
        margin-bottom: -1rem;
      `}
    >
      {levels.map((level, index) => (
        <MissionItem
          key={level.id}
          style={{ marginTop: index === 0 ? 0 : '1rem' }}
          mission={{
            title: level.title,
            id: level.id,
            subtitle: level.subtitle,
            levelKey: level.levelKey
          }}
        />
      ))}
    </div>
  );
}
