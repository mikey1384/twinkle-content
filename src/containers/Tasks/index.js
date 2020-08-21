import React from 'react';
import Cover from './Cover';
import CurrentTask from './CurrentTask';
import TaskList from './TaskList';
import { css } from 'emotion';

export default function Tasks() {
  return (
    <div>
      <Cover />
      <div style={{ margin: '5rem' }}>
        <div style={{ display: 'flex' }}>
          <CurrentTask
            className={css`
              width: 45%;
            `}
          />
          <TaskList style={{ marginLeft: '5rem', width: 'CALC(55% - 5rem)' }} />
        </div>
      </div>
    </div>
  );
}
