import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Color, borderRadius, innerBorderRadius } from 'constants/css';
import { css } from '@emotion/css';
import { returnMissionThumb } from 'constants/defaultValues';

MissionItem.propTypes = {
  missionType: PropTypes.string,
  style: PropTypes.object
};

export default function MissionItem({ missionType, style }) {
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
        height: 15rem;
        display: flex;
        flex-direction: column;
      `}
    >
      <div
        className={css`
          position: relative;
          width: 15rem;
          height: 10rem;
          padding-bottom: 10rem;
        `}
      >
        <img
          src={missionThumb}
          style={{
            cursor: 'pointer',
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
      <div style={{ paddingTop: '1rem', textAlign: 'center' }}>hello</div>
    </div>
  );
}
