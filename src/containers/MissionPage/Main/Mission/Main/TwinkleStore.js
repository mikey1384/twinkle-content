import React from 'react';
import PropTypes from 'prop-types';
import UsernameChangeItem from './username_change_item.png';

TwinkleStore.propTypes = {
  mission: PropTypes.object.isRequired
};

export default function TwinkleStore({ mission }) {
  return (
    <div style={{ fontSize: '1.7rem' }}>
      <p style={{ fontWeight: 'bold', fontSize: '2rem' }}>Instructions:</p>
      <p style={{ marginTop: '1.5rem' }}>
        <span>In </span>
        <a href="/store" target="_blank">
          Twinkle Store
        </a>
        <span>{`, you will see a section labeled "change your username"`}</span>
      </p>
      <img
        style={{ width: '100%', marginTop: '1rem' }}
        src={UsernameChangeItem}
      />
      <div>this is {mission.title}</div>
    </div>
  );
}
