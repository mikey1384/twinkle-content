import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTaskContext } from 'contexts';

TaskPage.propTypes = {
  match: PropTypes.object.isRequired
};

export default function TaskPage({
  match: {
    params: { taskId }
  }
}) {
  const {
    state: { taskObj }
  } = useTaskContext();

  useEffect(() => {
    console.log(taskObj[taskId]?.loaded);
  }, [taskId, taskObj]);

  return (
    <div>
      <div>{taskId}</div>
    </div>
  );
}
