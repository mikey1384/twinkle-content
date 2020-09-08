import request from 'axios';
import URL from 'constants/URL';

export default function taskRequestHelpers({ auth, handleError }) {
  return {
    async loadTask(taskId) {
      try {
        const { data } = await request.get(`${URL}/task/page?taskId=${taskId}`);
        return Promise.resolve(data);
      } catch (error) {
        return handleError(error);
      }
    },
    async loadTaskList() {
      try {
        const { data } = await request.get(`${URL}/task`);
        return Promise.resolve(data);
      } catch (error) {
        return handleError(error);
      }
    },
    async updateCurrentTask(taskId) {
      try {
        await request.put(`${URL}/task/current`, { taskId }, auth());
        return Promise.resolve();
      } catch (error) {
        return handleError(error);
      }
    }
  };
}
