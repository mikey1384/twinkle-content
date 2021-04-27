import React from 'react';
import PropTypes from 'prop-types';

Task.propTypes = {
  task: PropTypes.object
};

export default function Task({ task }) {
  console.log(task);
  return (
    <div>
      <div>This is a task page</div>
    </div>
  );
}
