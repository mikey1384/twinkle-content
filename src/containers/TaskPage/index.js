import React, { useEffect, useMemo } from 'react';
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

  const task = useMemo(() => taskObj[taskId] || {}, [taskId, taskObj]);

  useEffect(() => {
    if (!taskObj[taskId]?.loaded) {
      init();
    }
    async function init() {
      const data = await loadTask(taskId);
      onLoadTask(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId, taskObj]);

  return task ? (
    <div>
      <div>{task.title}</div>
    </div>
  ) : (
    <Loading />
  );
}
