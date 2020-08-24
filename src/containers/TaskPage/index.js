import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Loading from 'components/Loading';
import { useAppContext, useTaskContext } from 'contexts';

TaskPage.propTypes = {
  match: PropTypes.object.isRequired
};

export default function TaskPage({
  match: {
    params: { taskId }
  }
}) {
  const {
    requestHelpers: { loadTask }
  } = useAppContext();
  const {
    actions: { onLoadTask },
    state: { taskObj }
  } = useTaskContext();

  useEffect(() => {
    if (!taskObj[taskId]?.loaded) {
      init();
    }
    async function init() {
      const task = await loadTask(taskId);
      onLoadTask(task);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId, taskObj]);

  return taskObj[taskId] ? (
    <div>
      <div>{taskObj[taskId].title}</div>
    </div>
  ) : (
    <Loading />
  );
}
