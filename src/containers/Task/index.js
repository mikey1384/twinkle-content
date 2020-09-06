import React from 'react';
import Cover from './Cover';
import CurrentTask from './CurrentTask';
import TaskList from './TaskList';
import { css } from 'emotion';
import { useMyState } from 'helpers/hooks';

export default function Task() {
  const { currentTaskId } = useMyState();

  return (
    <div>
      <Cover />
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
            style={{
              marginLeft: '5rem',
              width: `CALC(${currentTaskId ? '55%' : '80%'} - 5rem)`
            }}
          />
        </div>
      </div>
    </div>
  );
}
