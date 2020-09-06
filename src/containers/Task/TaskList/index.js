import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import ListItem from './ListItem';
import { useAppContext, useTaskContext } from 'contexts';
import { gifTable } from 'constants/defaultValues';

TaskList.propTypes = {
  style: PropTypes.object,
  className: PropTypes.string
};

export default function TaskList({ style, className }) {
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
    <div style={style} className={className}>
      <p style={{ fontWeight: 'bold', fontSize: '2.5rem' }}>All Tasks</p>
      <div>
        <div style={{ marginTop: '1rem' }}>
          {tasks.map((taskId, index) => (
            <ListItem
              style={{ marginTop: index > 0 ? '1rem' : 0 }}
              key={taskId}
              taskId={taskId}
            >
              <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                {taskObj[taskId].title}
              </p>
              <div style={{ marginTop: '1rem', display: 'flex' }}>
                <img src={gifTable[taskId]} style={{ width: '10rem' }} />
                <div style={{ marginLeft: '1rem', fontSize: '1.7rem' }}>
                  {taskObj[taskId].subtitle}
                </div>
              </div>
            </ListItem>
          ))}
        </div>
      </div>
    </div>
  );
}
