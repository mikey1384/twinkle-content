import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Link from 'components/Link';
import { Color, borderRadius, innerBorderRadius } from 'constants/css';
import { css } from '@emotion/css';
import { returnMissionThumb } from 'constants/defaultValues';

MissionItem.propTypes = {
  missionName: PropTypes.string,
  missionType: PropTypes.string,
  style: PropTypes.object
};

export default function MissionItem({ missionName, missionType, style }) {
  const missionThumb = useMemo(
    () => returnMissionThumb(missionType),
    [missionType]
  );
  return (
    <Link
      style={style}
      to={`/missions/${missionType}`}
      className={css`
        border: 1px solid ${Color.borderGray()};
        border-radius: ${borderRadius};
        width: 15rem;
        height: 15rem;
        display: flex;
        flex-direction: column;
      `}
    >
      <div
        className={css`
          position: relative;
          width: 100%;
          height: 12rem;
          padding-bottom: 10rem;
        `}
      >
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
      <div
        style={{
          paddingLeft: '0.5rem',
          paddingRight: '0.5rem',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%'
        }}
      >
        <p
          style={{
            color: Color.blue(),
            fontSize: '1.2rem',
            fontWeight: 'bold',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            overflow: 'hidden'
          }}
        >
          {missionName}
        </p>
      </div>
    </Link>
  );
}
