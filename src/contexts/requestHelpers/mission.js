import request from 'axios';
import URL from 'constants/URL';

export default function missionRequestHelpers({ auth, handleError }) {
  return {
    async attachMissionTutorial({ missionId, missionTitle }) {
      try {
        const {
          data: { tutorialId }
        } = await request.post(
          `${URL}/mission/tutorial`,
          {
            missionId,
            missionTitle
          },
          auth()
        );
        return Promise.resolve(tutorialId);
      } catch (error) {
        return handleError(error);
      }
    },
    async loadMission(missionId) {
      try {
        const { data } = await request.get(
          `${URL}/mission/page?missionId=${missionId}`,
          auth()
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
        await request.put(
          `${URL}/mission/current`,
          { missionId: Number(missionId) },
          auth()
        );
        return Promise.resolve();
      } catch (error) {
        return handleError(error);
      }
    },
    async uploadMissionAttempt({ missionId, attempt }) {
      try {
        const {
          data: { success }
        } = await request.post(
          `${URL}/mission/attempt`,
          {
            missionId: Number(missionId),
            attempt
          },
          auth()
        );
        return Promise.resolve(success);
      } catch (error) {
        return handleError(error);
      }
    }
  };
}
