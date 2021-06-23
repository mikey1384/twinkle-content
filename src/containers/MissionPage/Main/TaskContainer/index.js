import React, { useEffect, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import GoBack from 'components/GoBack';
import Task from './Task';
import Tutorial from '../Tutorial';
import InvalidPage from 'components/InvalidPage';
import Loading from 'components/Loading';
import { useMyState } from 'helpers/hooks';
import { css } from '@emotion/css';
import { mobileMaxWidth } from 'constants/css';
import { useAppContext, useMissionContext } from 'contexts';
import NotUnlocked from './NotUnlocked';

TaskContainer.propTypes = {
  match: PropTypes.object.isRequired,
  mission: PropTypes.object.isRequired
};

export default function TaskContainer({
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
    actions: {
      onSetMissionState,
      onLoadMission,
      onLoadMissionTypeIdHash,
      onSetMyMissionAttempts
    },
    state: { missionObj, missionTypeIdHash, myAttempts, prevUserId }
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
        const { page, myAttempts } = await loadMission({
          missionId: taskId,
          isTask: true
        });
        if (mounted.current) {
          onLoadMission({ mission: page, prevUserId: userId });
        }
        if (mounted.current) {
          onSetMyMissionAttempts(myAttempts);
        }
      } else {
        onLoadMission({ mission: { id: taskId }, prevUserId: userId });
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, prevUserId, taskId, mission.loaded]);

  const taskOrder = useMemo(() => {
    const result = [];
    for (let subMission of mission?.subMissions) {
      for (let task of subMission?.tasks) {
        result.push(task.missionType);
      }
    }
    return result;
  }, [mission.subMissions]);

  const currentTaskOrderIndex = useMemo(
    () => taskOrder.indexOf(taskType),
    [taskOrder, taskType]
  );

  const nextTask = useMemo(() => {
    const finalTaskIndex = taskOrder.length - 1;
    if (currentTaskOrderIndex < finalTaskIndex) {
      return taskOrder[currentTaskOrderIndex + 1];
    }
    return '';
  }, [currentTaskOrderIndex, taskOrder]);

  const prevTaskPassed = useMemo(() => {
    if (currentTaskOrderIndex === 0) {
      return true;
    }
    if (currentTaskOrderIndex > 0 && myAttempts.loaded) {
      const prevTaskType = taskOrder[currentTaskOrderIndex - 1];
      const prevTaskId = missionTypeIdHash[prevTaskType];
      if (myAttempts[prevTaskId].status === 'pass') {
        return true;
      }
    }
    return false;
  }, [currentTaskOrderIndex, missionTypeIdHash, myAttempts, taskOrder]);

  if (userId && taskType && missionTypeIdHash && !missionTypeIdHash[taskType]) {
    return <InvalidPage />;
  }

  if (!myAttempts.loaded) {
    return <Loading />;
  }

  if (!prevTaskPassed) {
    return <NotUnlocked missionTitle={mission.title} />;
  }

  return (
    <div style={{ width: '100%' }}>
      <GoBack bordered to="./" text={mission.title} />
      <Task
        style={{ width: '100%', marginTop: '2rem' }}
        task={task}
        onSetMissionState={onSetMissionState}
        nextTaskType={nextTask}
      />
      <Tutorial
        mission={task}
        myAttempts={myAttempts}
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
