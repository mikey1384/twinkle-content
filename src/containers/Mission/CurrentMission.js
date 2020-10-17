import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { css } from 'emotion';
import { borderRadius, Color, mobileMaxWidth } from 'constants/css';
import { useHistory } from 'react-router-dom';
import { gifTable } from 'constants/defaultValues';
import { useMissionContext } from 'contexts';

CurrentMission.propTypes = {
  style: PropTypes.object,
  className: PropTypes.string,
  missionId: PropTypes.number
};

export default function CurrentMission({ style, className, missionId }) {
  const history = useHistory();
  const {
    state: { missionObj }
  } = useMissionContext();
  const mission = useMemo(() => missionObj[missionId] || {}, [
    missionId,
    missionObj
  ]);

  return (
    <div style={style} className={className}>
      <p
        className={css`
          font-size: 2.5rem;
          font-weight: bold;
        `}
      >
        Current Mission
      </p>
      <div
        onClick={() => history.push(`/missions/${missionId}`)}
        className={css`
          background: #fff;
          display: flex;
          flex-direction: column;
          font-size: 3rem;
          margin-top: 1rem;
          border: 1px solid ${Color.borderGray()};
          padding: 1rem 1rem 3rem 1rem;
          border-radius: ${borderRadius};
          cursor: pointer;
          &:hover {
            background: ${Color.highlightGray()};
          }
          @media (max-width: ${mobileMaxWidth}) {
            font-size: 2.3rem;
          }
        `}
      >
        <div style={{ fontWeight: 'bold' }}>{mission.title}</div>
        <div style={{ marginTop: '2rem', display: 'flex', width: '100%' }}>
          <img style={{ width: '100%' }} src={gifTable[missionId]} />
        </div>
      </div>
    </div>
  );
}
