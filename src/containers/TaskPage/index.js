import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import Loading from 'components/Loading';
import Task from './Task';
import Tutorial from './Tutorial';
import InvalidPage from 'components/InvalidPage';
import { useMyState } from 'helpers/hooks';
import { useAppContext, useContentContext, useTaskContext } from 'contexts';

TaskPage.propTypes = {
  match: PropTypes.object.isRequired
};

export default function TaskPage({
  match: {
    params: { taskId }
  }
}) {
  const { loaded, userId } = useMyState();
  const {
    requestHelpers: { loadTask, updateCurrentTask }
  } = useAppContext();
  const {
    actions: { onUpdateCurrentTask }
  } = useContentContext();
  const {
    actions: { onLoadTask },
    state: { taskObj }
  } = useTaskContext();

  const task = useMemo(() => taskObj[taskId] || {}, [taskId, taskObj]);

  useEffect(() => {
    if (userId) {
      updateCurrentTask(taskId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  useEffect(() => {
    onUpdateCurrentTask({ taskId: Number(taskId), userId });
    if (!task.loaded) {
      init();
    }

    async function init() {
      const data = await loadTask(taskId);
      onLoadTask(data);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return loaded ? (
    userId ? (
      <div style={{ paddingTop: '1rem' }}>
        {task ? (
          <div
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column'
            }}
          >
            <Task
              taskId={task.id}
              description={task.description}
              subtitle={task.subtitle}
              taskType={task.taskType}
              title={task.title}
            />
            <Tutorial
              style={{ marginTop: '5rem' }}
              tutorialId={task.tutorialId}
            />
          </div>
        ) : (
          <Loading text="Loading Task..." />
        )}
      </div>
    ) : (
      <InvalidPage
        title="For Registered Users Only"
        text="Please Log In or Sign Up"
      />
    )
  ) : (
    <Loading />
  );
}
