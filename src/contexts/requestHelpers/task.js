import request from 'axios';
import URL from 'constants/URL';

export default function taskRequestHelpers({ auth, handleError }) {
  return {
    async loadTasks() {
      try {
        await request.get(`${URL}/task`, auth());
        return Promise.resolve();
      } catch (error) {
        return handleError(error);
      }
    }
  };
}
