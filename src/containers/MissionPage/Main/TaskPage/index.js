import React, { useEffect, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import GoBack from 'components/GoBack';
import Task from './Task';
import Tutorial from '../Tutorial';
import { useMyState } from 'helpers/hooks';
import { css } from '@emotion/css';
import { mobileMaxWidth } from 'constants/css';
import { useAppContext, useMissionContext } from 'contexts';

TaskPage.propTypes = {
  match: PropTypes.object.isRequired,
  mission: PropTypes.object.isRequired
};

export default function TaskPage({
  match: {
    params: { taskType }
  },
  mission
}) {
  const mounted = useRef(true);
  const { userId } = useMyState();
  const {
    requestHelpers: { loadMission, loadMissionTypeIdHash }
  } = useAppContext();
  const {
    actions: { onSetMissionState, onLoadMission, onLoadMissionTypeIdHash },
    state: { missionObj, missionTypeIdHash, prevUserId }
  } = useMissionContext();

  const taskId = useMemo(() => {
    return missionTypeIdHash?.[taskType];
  }, [missionTypeIdHash, taskType]);

  const task = useMemo(() => missionObj[taskId] || {}, [taskId, missionObj]);

  useEffect(() => {
    if (!taskId) {
      getMissionId();
    } else if (!task.loaded || (userId && prevUserId !== userId)) {
      init();
    }

    async function getMissionId() {
      const data = await loadMissionTypeIdHash();
      onLoadMissionTypeIdHash(data);
    }

    async function init() {
      if (userId) {
        const data = await loadMission(taskId);
        if (mounted.current) {
          onLoadMission({ mission: data, prevUserId: userId });
        }
      } else {
        onLoadMission({ mission: { id: taskId }, prevUserId: userId });
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, prevUserId, taskId, mission.loaded]);

  return (
    <div style={{ width: '100%' }}>
      <GoBack bordered to="./" text={mission.title} />
      <Task
        style={{ width: '100%', marginTop: '2rem' }}
        task={task}
        onSetMissionState={onSetMissionState}
      />
      <Tutorial
        mission={task}
        className={css`
          margin-top: 5rem;
          margin-bottom: 1rem;
          width: 100%;
          @media (max-width: ${mobileMaxWidth}) {
            margin-top: 2rem;
          }
        `}
        onSetMissionState={onSetMissionState}
      />
    </div>
  );
}
