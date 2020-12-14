import request from 'axios';
import URL from 'constants/URL';

export default function missionRequestHelpers({ auth, handleError }) {
  return {
    async approveGrammarQuestion(questionId) {
      try {
        const {
          data: { success }
        } = await request.put(
          `${URL}/mission/grammar/question/approve`,
          { questionId },
          auth()
        );
        return Promise.resolve(success);
      } catch (error) {
        return handleError(error);
      }
    },
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
    async checkMissionStatus(missionId) {
      try {
        const {
          data: { filePath, feedback, status }
        } = await request.get(
          `${URL}/mission/status?missionId=${missionId}`,
          auth()
        );
        return Promise.resolve({ filePath, feedback, status });
      } catch (error) {
        return handleError(error);
      }
    },
    async loadGrammarQuestions(activeTab) {
      try {
        const { data } = await request.get(
          `${URL}/mission/grammar/question?activeTab=${activeTab}`,
          auth()
        );
        return Promise.resolve(data);
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
    async loadMissionAttempts({ activeTab, missionId, lastAttemptId }) {
      try {
        const { data } = await request.get(
          `${URL}/mission/attempt?activeTab=${activeTab}&missionId=${missionId}${
            lastAttemptId ? `&lastAttemptId=${lastAttemptId}` : ''
          }`,
          auth()
        );
        return Promise.resolve(data);
      } catch (error) {
        return handleError(error);
      }
    },
    async loadMissionList() {
      try {
        const { data } = await request.get(`${URL}/mission`, auth());
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
    async uploadGrammarQuestion({
      leftSideText,
      rightSideText,
      correctChoice,
      wrongChoice1,
      wrongChoice2,
      wrongChoice3
    }) {
      try {
        const {
          data: { alreadyExists, success }
        } = await request.post(
          `${URL}/mission/grammar/question`,
          {
            leftSideText,
            rightSideText,
            correctChoice,
            wrongChoice1,
            wrongChoice2,
            wrongChoice3
          },
          auth()
        );
        return Promise.resolve({ alreadyExists, success });
      } catch (error) {
        return handleError(error);
      }
    },
    async uploadMissionAttempt({ missionId, attempt }) {
      try {
        const {
          data: { success, newXpAndRank, newCoins }
        } = await request.post(
          `${URL}/mission/attempt`,
          {
            missionId: Number(missionId),
            attempt
          },
          auth()
        );
        return Promise.resolve({ success, newXpAndRank, newCoins });
      } catch (error) {
        return handleError(error);
      }
    },
    async uploadMissionFeedback({ attemptId, feedback, status }) {
      try {
        const {
          data: { success }
        } = await request.put(
          `${URL}/mission/attempt`,
          {
            attemptId,
            feedback,
            status
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
