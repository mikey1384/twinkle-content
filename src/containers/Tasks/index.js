import React from 'react';
import Cover from './Cover';
import CurrentTask from './CurrentTask';

export default function Tasks() {
  return (
    <div>
      <Cover />
      <div style={{ margin: '3rem' }}>
        <CurrentTask />
      </div>
    </div>
  );
}
