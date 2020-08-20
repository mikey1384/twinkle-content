import React from 'react';
import PropTypes from 'prop-types';
import ListItem from './ListItem';
import Screenshot from '../screenshot.png';

TaskList.propTypes = {
  style: PropTypes.object,
  className: PropTypes.string
};
export default function TaskList({ style, className }) {
  return (
    <div style={style} className={className}>
      <p style={{ fontWeight: 'bold', fontSize: '2.5rem' }}>All Tasks</p>
      <div>
        <div style={{ marginTop: '1rem' }}>
          <ListItem>
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
          <ListItem style={{ marginTop: '1rem' }}>
            <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>
              Copy and Paste
            </p>
            <div style={{ marginTop: '1rem', display: 'flex' }}>
              <img src={Screenshot} style={{ width: '10rem' }} />
              <div style={{ marginLeft: '1rem', fontSize: '1.7rem' }}>
                {`Copy a block of text and paste it somewhere else!`}
              </div>
            </div>
          </ListItem>
          <ListItem style={{ marginTop: '1rem' }}>
            <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>Google</p>
            <div style={{ marginTop: '1rem', display: 'flex' }}>
              <img src={Screenshot} style={{ width: '10rem' }} />
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
