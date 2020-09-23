import request from 'axios';
import URL from 'constants/URL';

export default function interactiveRequestHelpers({ auth, handleError }) {
  return {
    async addInteractiveSlide({ interactiveId, lastFork }) {
      try {
        const { data } = await request.post(
          `${URL}/interactive/slide`,
          { interactiveId, lastFork },
          auth()
        );
        return Promise.resolve(data);
      } catch (error) {
        return handleError(error);
      }
    },
    async deleteInteractiveSlide(slideId) {
      try {
        const { data } = await request.delete(
          `${URL}/interactive/slide?slideId=${slideId}`,
          auth()
        );
        return Promise.resolve(data);
      } catch (error) {
        return handleError(error);
      }
    },
    async loadInteractive(contentId) {
      try {
        const { data } = await request.get(
          `${URL}/interactive?contentId=${contentId}`,
          auth()
        );
        return Promise.resolve(data);
      } catch (error) {
        return handleError(error);
      }
    },
    async editInteractiveSlide({ interactiveId, slideId, post }) {
      try {
        const {
          data: { success }
        } = await request.put(
          `${URL}/interactive/slide`,
          { interactiveId, slideId, post },
          auth()
        );
        return Promise.resolve(success);
      } catch (error) {
        return handleError(error);
      }
    }
  };
}
