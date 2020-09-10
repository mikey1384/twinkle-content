import request from 'axios';
import URL from 'constants/URL';

export default function taskRequestHelpers({ auth, handleError }) {
  return {
    async loadMission(missionId) {
      try {
        const { data } = await request.get(
          `${URL}/mission/page?missionId=${missionId}`
        );
        return Promise.resolve(data);
      } catch (error) {
        return handleError(error);
      }
    },
    async loadMissionList() {
      try {
        const { data } = await request.get(`${URL}/mission`);
        return Promise.resolve(data);
      } catch (error) {
        return handleError(error);
      }
    },
    async updateCurrentMission(missionId) {
      try {
        await request.put(`${URL}/mission/current`, { missionId }, auth());
        return Promise.resolve();
      } catch (error) {
        return handleError(error);
      }
    }
  };
}
