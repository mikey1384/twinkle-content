import React, { useEffect } from 'react';
import Cover from './Cover';
import CurrentTask from './CurrentTask';
import TaskList from './TaskList';
import { css } from 'emotion';
import { useMyState } from 'helpers/hooks';
import { useAppContext, useTaskContext } from 'contexts';

export default function Task() {
  const { currentTaskId, userId } = useMyState();
  const {
    requestHelpers: { loadTaskList }
  } = useAppContext();
  const {
    state: { tasks, taskObj },
    actions: { onLoadTaskList }
  } = useTaskContext();

  useEffect(() => {
    init();

    async function init() {
      const { tasks, loadMoreButton } = await loadTaskList();
      onLoadTaskList({ tasks, loadMoreButton });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      {userId && <Cover />}
      {tasks.length > 0 && (
        <div style={{ margin: '5rem' }}>
          <div style={{ display: 'flex' }}>
            {currentTaskId && (
              <CurrentTask
                taskId={currentTaskId}
                className={css`
                  width: 45%;
                `}
              />
            )}
            <TaskList
              tasks={tasks}
              taskObj={taskObj}
              style={{
                marginLeft: '5rem',
                width: `CALC(${currentTaskId ? '55%' : '80%'} - 5rem)`
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
