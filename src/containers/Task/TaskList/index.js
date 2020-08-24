import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import ListItem from './ListItem';
import Screenshot from '../takingscreenshot.gif';
import CopyPaste from '../copypaste.gif';
import HowToGoogle from '../howtogoogle.gif';
import { useAppContext, useTaskContext } from 'contexts';

TaskList.propTypes = {
  style: PropTypes.object,
  className: PropTypes.string
};

export default function TaskList({ style, className }) {
  const gifTable = {
    1: CopyPaste,
    2: Screenshot,
    3: HowToGoogle
  };
  const {
    requestHelpers: { loadTasks }
  } = useAppContext();
  const {
    state: { tasks },
    actions: { onLoadTasks }
  } = useTaskContext();

  useEffect(() => {
    init();

    async function init() {
      const { tasks, loadMoreButton } = await loadTasks();
      onLoadTasks({ tasks, loadMoreButton });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={style} className={className}>
      <p style={{ fontWeight: 'bold', fontSize: '2.5rem' }}>All Task</p>
      <div>
        <div style={{ marginTop: '1rem' }}>
          {tasks.map(({ id, title, subtitle }, index) => (
            <ListItem
              style={{ marginTop: index > 0 ? '1rem' : 0 }}
              key={id}
              taskId={id}
            >
              <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{title}</p>
              <div style={{ marginTop: '1rem', display: 'flex' }}>
                <img src={gifTable[id]} style={{ width: '10rem' }} />
                <div style={{ marginLeft: '1rem', fontSize: '1.7rem' }}>
                  {subtitle}
                </div>
              </div>
            </ListItem>
          ))}
        </div>
      </div>
    </div>
  );
}
