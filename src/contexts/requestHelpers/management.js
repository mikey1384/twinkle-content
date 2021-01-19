import request from 'axios';
import URL from 'constants/URL';

export default function managementRequestHelpers({ auth, handleError }) {
  return {
    async loadDeletedPosts() {
      try {
        const { data } = await request.get(`${URL}/management/deleted`, auth());
        return Promise.resolve(data);
      } catch (error) {
        return handleError(error);
      }
    }
  };
}
