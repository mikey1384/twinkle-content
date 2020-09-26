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
    async editInteractiveSlide({ slideId, post }) {
      try {
        const { data } = await request.put(
          `${URL}/interactive/slide`,
          { slideId, post },
          auth()
        );
        return Promise.resolve(data);
      } catch (error) {
        return handleError(error);
      }
    },
    async publishInteractiveSlide(slideId) {
      try {
        const {
          data: { success }
        } = await request.put(
          `${URL}/interactive/slide/publish`,
          { slideId },
          auth()
        );
        return Promise.resolve(success);
      } catch (error) {
        return handleError(error);
      }
    },
    async updateEmbedData({
      slideId,
      thumbUrl,
      actualTitle,
      actualDescription,
      siteUrl
    }) {
      try {
        const {
          data: { success }
        } = await request.put(
          `${URL}/interactive/slide/embed`,
          { slideId, thumbUrl, actualTitle, actualDescription, siteUrl },
          auth()
        );
        return Promise.resolve(success);
      } catch (error) {
        return handleError(error);
      }
    }
  };
}
