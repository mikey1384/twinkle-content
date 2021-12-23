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
  if (!mission.isMultiMission) {
    return <InvalidPage />;
  }
  const mounted = useRef(true);
  const TutorialRef = useRef(null);
  const { userId, isCreator } = useMyState();
  const loadMission = useAppContext((v) => v.requestHelpers.loadMission);
  const loadMissionTypeIdHash = useAppContext(
    (v) => v.requestHelpers.loadMissionTypeIdHash
  );
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
    for (let subMission of mission?.subMissions || []) {
      for (let task of subMission?.tasks || []) {
        result.push(task.missionType);
      }
    }
    return result;
  }, [mission.subMissions]);

  const currentTaskOrderIndex = useMemo(
    () => taskOrder.indexOf(taskType),
    [taskOrder, taskType]
  );

  if (currentTaskOrderIndex === -1) {
    return <InvalidPage />;
  }

  const nextTask = useMemo(() => {
    const finalTaskIndex = taskOrder.length - 1;
    if (currentTaskOrderIndex < finalTaskIndex) {
      return taskOrder[currentTaskOrderIndex + 1];
    }
    return '';
  }, [currentTaskOrderIndex, taskOrder]);

  const prevTaskPassed = useMemo(() => {
    if (isCreator || currentTaskOrderIndex === 0) {
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
  }, [
    isCreator,
    currentTaskOrderIndex,
    missionTypeIdHash,
    myAttempts,
    taskOrder
  ]);

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
      <GoBack isAtTop={!isCreator} bordered to="./" text={mission.title} />
      <Task
        style={{ width: '100%', marginTop: '2rem' }}
        task={task}
        onSetMissionState={onSetMissionState}
        tutorialRef={TutorialRef}
        nextTaskType={nextTask}
      />
      <GoBack
        isAtTop={false}
        style={{ marginTop: '2rem' }}
        bordered
        to="./"
        text={mission.title}
      />
      <Tutorial
        mission={task}
        myAttempts={myAttempts}
        innerRef={TutorialRef}
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
