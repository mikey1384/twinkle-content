import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import Loading from 'components/Loading';
import Task from './Task';
import Tutorial from './Tutorial';
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
  const { userId } = useMyState();
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
    init();

    async function init() {
      updateCurrentTask(taskId);
      onUpdateCurrentTask({ taskId, userId });
      if (!taskObj[taskId]?.loaded) {
        const data = await loadTask(taskId);
        onLoadTask(data);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId, taskObj]);

  return (
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
            title={task.title}
            buttonLabel={task.buttonLabel}
          />
          <Tutorial style={{ marginTop: '5rem' }} />
        </div>
      ) : (
        <Loading text="Loading Task..." />
      )}
    </div>
  );
}
