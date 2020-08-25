import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import Loading from 'components/Loading';
import Task from './Task';
import { useAppContext, useTaskContext } from 'contexts';

TaskPage.propTypes = {
  match: PropTypes.object.isRequired
};

export default function TaskPage({
  match: {
    params: { taskId }
  }
}) {
  const {
    requestHelpers: { loadTask }
  } = useAppContext();
  const {
    actions: { onLoadTask },
    state: { taskObj }
  } = useTaskContext();

  const task = useMemo(() => taskObj[taskId] || {}, [taskId, taskObj]);

  useEffect(() => {
    if (!taskObj[taskId]?.loaded) {
      init();
    }
    async function init() {
      const data = await loadTask(taskId);
      onLoadTask(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId, taskObj]);

  return (
    <div style={{ paddingTop: '1rem' }}>
      {task ? (
        <div
          style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
        >
          <Task
            taskId={task.id}
            description={task.description}
            subtitle={task.subtitle}
            title={task.title}
            style={{
              width: '50%'
            }}
          />
        </div>
      ) : (
        <Loading text="Loading Task..." />
      )}
    </div>
  );
}
