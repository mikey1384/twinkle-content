import React from 'react';
import PropTypes from 'prop-types';
import ListItem from './ListItem';
import { gifTable } from 'constants/defaultValues';
import { css } from 'emotion';
import { mobileMaxWidth } from 'constants/css';

MissionList.propTypes = {
  style: PropTypes.object,
  className: PropTypes.string,
  missions: PropTypes.array.isRequired,
  missionObj: PropTypes.object.isRequired
};

export default function MissionList({
  style,
  className,
  missions,
  missionObj
}) {
  return (
    <div style={style} className={className}>
      <p style={{ fontWeight: 'bold', fontSize: '2.5rem' }}>All Missions</p>
      <div>
        <div style={{ marginTop: '1rem' }}>
          {missions.map((missionId, index) => (
            <ListItem
              style={{ marginTop: index > 0 ? '1rem' : 0 }}
              key={missionId}
              missionId={missionId}
            >
              <p
                className={css`
                  font-size: 2rem;
                  font-weight: bold;
                  @media (max-width: ${mobileMaxWidth}) {
                    font-size: 1.7rem;
                  }
                `}
              >
                {missionObj[missionId].title}
              </p>
              <div style={{ marginTop: '1rem', display: 'flex' }}>
                <img src={gifTable[missionId]} style={{ width: '10rem' }} />
                <div
                  className={css`
                    margin-left: 1rem;
                    font-size: 1.7rem;
                    @media (max-width: ${mobileMaxWidth}) {
                      font-size: 1.3rem;
                    }
                  `}
                >
                  {missionObj[missionId].subtitle}
                </div>
              </div>
            </ListItem>
          ))}
        </div>
      </div>
    </div>
  );
}
