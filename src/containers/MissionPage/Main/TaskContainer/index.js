import React, { useEffect, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import GoBack from 'components/GoBack';
import Task from './Task';
import Tutorial from '../Tutorial';
import InvalidPage from 'components/InvalidPage';
import Loading from 'components/Loading';
import { useMyState } from 'helpers/hooks';
import { css } from '@emotion/css';
import { useParams } from 'react-router-dom';
import { mobileMaxWidth } from 'constants/css';
import { useAppContext, useMissionContext } from 'contexts';
import NotUnlocked from './NotUnlocked';
import TutorialModal from '../TutorialModal';

TaskContainer.propTypes = {
  mission: PropTypes.object.isRequired
};

export default function TaskContainer({ mission }) {
  const { taskType } = useParams();
  const { userId, managementLevel } = useMyState();
  const missionTypeIdHash = useMissionContext((v) => v.state.missionTypeIdHash);
  const taskId = useMemo(() => {
    if (!taskType) return null;
    return missionTypeIdHash?.[taskType];
  }, [missionTypeIdHash, taskType]);
  const TutorialRef = useRef(null);
  const isManager = useMemo(() => managementLevel >= 2, [managementLevel]);
  const loadMission = useAppContext((v) => v.requestHelpers.loadMission);
  const loadMissionTypeIdHash = useAppContext(
    (v) => v.requestHelpers.loadMissionTypeIdHash
  );
  const onSetMissionState = useMissionContext(
    (v) => v.actions.onSetMissionState
  );
  const onLoadMission = useMissionContext((v) => v.actions.onLoadMission);
  const onLoadMissionTypeIdHash = useMissionContext(
    (v) => v.actions.onLoadMissionTypeIdHash
  );
  const onSetMyMissionAttempts = useMissionContext(
    (v) => v.actions.onSetMyMissionAttempts
  );
  const missionObj = useMissionContext((v) => v.state.missionObj);
  const myAttempts = useMissionContext((v) => v.state.myAttempts);
  const prevUserId = useMissionContext((v) => v.state.prevUserId);

  const task = missionObj[taskId] || {};

  useEffect(() => {
    if (!taskId) {
      getMissionId();
    } else if (!task.loaded || (userId && prevUserId !== userId)) {
      init();
    }

    async function init() {
      if (userId) {
        const { page, myAttempts } = await loadMission({
          missionId: taskId,
          isTask: true
        });
        onLoadMission({ mission: page, prevUserId: userId });
        onSetMyMissionAttempts(myAttempts);
      } else {
        onLoadMission({ mission: { id: taskId }, prevUserId: userId });
      }
    }
    async function getMissionId() {
      const data = await loadMissionTypeIdHash();
      onLoadMissionTypeIdHash(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, prevUserId, taskId, mission.loaded, task.loaded]);

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

  const nextTask = useMemo(() => {
    const finalTaskIndex = taskOrder.length - 1;
    if (currentTaskOrderIndex < finalTaskIndex) {
      return taskOrder[currentTaskOrderIndex + 1];
    }
    return '';
  }, [currentTaskOrderIndex, taskOrder]);

  const prevTaskPassed = useMemo(() => {
    if (isManager || currentTaskOrderIndex === 0) {
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
    isManager,
    currentTaskOrderIndex,
    missionTypeIdHash,
    myAttempts,
    taskOrder
  ]);

  if (!!mission.prevUserId && !mission.isMultiMission) {
    return <InvalidPage />;
  }

  if (!!mission.prevUserId && currentTaskOrderIndex === -1) {
    return <InvalidPage />;
  }

  if (userId && taskType && missionTypeIdHash && !missionTypeIdHash[taskType]) {
    return <InvalidPage />;
  }

  if (!mission.prevUserId || !myAttempts.loaded) {
    return <Loading />;
  }

  if (!prevTaskPassed) {
    return <NotUnlocked missionTitle={mission.title} />;
  }

  return (
    <div style={{ width: '100%' }}>
      <GoBack isAtTop={!isManager} bordered to=".." text={mission.title} />
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
        to=".."
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
      {task.tutorialStarted && (
        <TutorialModal
          missionTitle={task.title}
          tutorialId={task.tutorialId}
          tutorialSlideId={task.tutorialSlideId}
          onCurrentSlideIdChange={(slideId) =>
            onSetMissionState({
              missionId: task.id,
              newState: { tutorialSlideId: slideId }
            })
          }
          onHide={() =>
            onSetMissionState({
              missionId: task.id,
              newState: { tutorialStarted: false }
            })
          }
        />
      )}
    </div>
  );
}
