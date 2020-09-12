import React from 'react';
import PropTypes from 'prop-types';
import ListItem from './ListItem';
import { gifTable } from 'constants/defaultValues';

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
              <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                {missionObj[missionId].title}
              </p>
              <div style={{ marginTop: '1rem', display: 'flex' }}>
                <img src={gifTable[missionId]} style={{ width: '10rem' }} />
                <div style={{ marginLeft: '1rem', fontSize: '1.7rem' }}>
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
