import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import ListItem from './ListItem';
import Screenshot from '../takingscreenshot.gif';
import CopyPaste from '../copypaste.gif';
import HowToGoogle from '../howtogoogle.gif';
import { useTasksContext } from 'contexts';

TaskList.propTypes = {
  style: PropTypes.object,
  className: PropTypes.string
};

export default function TaskList({ style, className }) {
  const {
    actions: { onLoadTasks }
  } = useTasksContext();

  useEffect(() => {
    onLoadTasks({ tasks: [], loadMoreButton: false });
  }, []);

  return (
    <div style={style} className={className}>
      <p style={{ fontWeight: 'bold', fontSize: '2.5rem' }}>All Tasks</p>
      <div>
        <div style={{ marginTop: '1rem' }}>
          <ListItem taskId={1}>
            <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>
              Copy and Paste
            </p>
            <div style={{ marginTop: '1rem', display: 'flex' }}>
              <img src={CopyPaste} style={{ width: '10rem' }} />
              <div style={{ marginLeft: '1rem', fontSize: '1.7rem' }}>
                {`Copy a block of text and paste it somewhere else!`}
              </div>
            </div>
          </ListItem>
          <ListItem taskId={2} style={{ marginTop: '1rem' }}>
            <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>
              Take a Screenshot
            </p>
            <div style={{ marginTop: '1rem', display: 'flex' }}>
              <img src={Screenshot} style={{ width: '10rem' }} />
              <div style={{ marginLeft: '1rem', fontSize: '1.7rem' }}>
                {`Take a picture of your computer screen!`}
              </div>
            </div>
          </ListItem>
          <ListItem taskId={3} style={{ marginTop: '1rem' }}>
            <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>Google</p>
            <div style={{ marginTop: '1rem', display: 'flex' }}>
              <img src={HowToGoogle} style={{ width: '10rem' }} />
              <div style={{ marginLeft: '1rem', fontSize: '1.7rem' }}>
                {`Search something you didn't know about on Google`}
              </div>
            </div>
          </ListItem>
        </div>
      </div>
    </div>
  );
}
