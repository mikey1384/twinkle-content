import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Link from 'components/Link';
import { Color, borderRadius, innerBorderRadius } from 'constants/css';
import { css } from '@emotion/css';
import { returnMissionThumb } from 'constants/defaultValues';

MissionItem.propTypes = {
  completed: PropTypes.bool,
  missionName: PropTypes.string,
  taskProgress: PropTypes.string,
  missionType: PropTypes.string,
  style: PropTypes.object
};

export default function MissionItem({
  completed,
  missionName,
  taskProgress,
  missionType,
  style
}) {
  const missionThumb = useMemo(
    () => returnMissionThumb(missionType),
    [missionType]
  );
  return (
    <div
      style={style}
      className={css`
        border: 1px solid ${Color.borderGray()};
        border-radius: ${borderRadius};
        width: 15rem;
        height: 15rem;
        display: flex;
        flex-direction: column;
      `}
    >
      <Link
        className={css`
          position: relative;
          width: 100%;
          height: 12rem;
          padding-bottom: 10rem;
        `}
        to={`/missions/${missionType}`}
      >
        <div>
          <img
            src={missionThumb}
            style={{
              borderTopLeftRadius: innerBorderRadius,
              borderTopRightRadius: innerBorderRadius,
              position: 'absolute',
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center'
            }}
          />
        </div>
      </Link>
      <div
        style={{
          paddingLeft: '0.5rem',
          paddingRight: '0.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '100%'
        }}
      >
        <Link
          to={`/missions/${missionType}`}
          style={{
            width: '100%',
            textAlign: 'center',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            overflow: 'hidden'
          }}
        >
          {missionName}
        </Link>
        {taskProgress && !completed ? (
          <div
            style={{
              textAlign: 'center',
              fontWeight: 'bold',
              color: Color.green()
            }}
          >
            {taskProgress} complete
          </div>
        ) : null}
      </div>
    </div>
  );
}
