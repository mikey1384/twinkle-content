import React from 'react';
import PropTypes from 'prop-types';
import ListItem from './ListItem';
import { gifTable } from 'constants/defaultValues';

TaskList.propTypes = {
  style: PropTypes.object,
  className: PropTypes.string,
  tasks: PropTypes.array.isRequired,
  taskObj: PropTypes.object.isRequired
};

export default function TaskList({ style, className, tasks, taskObj }) {
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
