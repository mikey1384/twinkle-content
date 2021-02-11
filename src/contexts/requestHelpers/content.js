import request from 'axios';
import URL from 'constants/URL';
import { queryStringForArray, stringIsEmpty } from 'helpers/stringHelpers';

export default function contentRequestHelpers({ auth, handleError }) {
  return {
    async addVideoToPlaylists({ videoId, playlistIds }) {
      try {
        await request.post(
          `${URL}/playlist/videoToPlaylists`,
          { videoId, playlistIds },
          auth()
        );
        return Promise.resolve();
      } catch (error) {
        return handleError(error);
      }
    },
    async addVideoView(params) {
      try {
        request.post(`${URL}/video/view`, params);
      } catch (error) {
        return handleError(error);
      }
    },
    async checkContentUrl({ url, videoCode, contentType }) {
      try {
        const {
          data: { exists, content, ytDetails }
        } = await request.get(
          `${URL}/content/checkUrl?url=${encodeURIComponent(
            url
          )}&contentType=${contentType}${
            videoCode ? `&videoCode=${videoCode}` : ''
          }`
        );
        return Promise.resolve({ exists, content, ytDetails });
      } catch (error) {
        return handleError(error);
      }
    },
    async checkIfHomeOutdated({ lastInteraction, category, subFilter }) {
      try {
        const { data } = await request.get(
          `${URL}/content/outdated?lastInteraction=${lastInteraction}&category=${category}&subFilter=${subFilter}`
        );
        return Promise.resolve(data);
      } catch (error) {
        return handleError(error);
      }
    },
    async checkIfUserResponded(subjectId) {
      try {
        const { data } = await request.get(
          `${URL}/content/checkResponded?subjectId=${subjectId}`,
          auth()
        );
        return Promise.resolve(data);
      } catch (error) {
        return handleError(error);
      }
    },
    async checkXPEarned(videoId) {
      try {
        const {
          data: { xpEarned }
        } = await request.get(
          `${URL}/video/xpEarned?videoId=${videoId}`,
          auth()
        );
        return Promise.resolve(xpEarned);
      } catch (error) {
        return handleError(error);
      }
    },
    async deleteContent({ id, contentType, undo }) {
      try {
        const {
          data: { success, isRecovered }
        } = await request.delete(
          `${URL}/content?contentId=${id}&contentType=${contentType}${
            undo ? '&undo=1' : ''
          }`,
          auth()
        );
        return Promise.resolve({
          contentId: id,
          contentType,
          success,
          isRecovered
        });
      } catch (error) {
        return handleError(error);
      }
    },
    async deletePlaylist(playlistId) {
      try {
        await request.delete(
          `${URL}/playlist?playlistId=${playlistId}`,
          auth()
        );
        return Promise.resolve();
      } catch (error) {
        return handleError(error);
      }
    },
    async deleteSubject({ filePath, fileName, subjectId }) {
      try {
        await request.delete(
          `${URL}/content/subjects?subjectId=${subjectId}${
            filePath ? `&filePath=${filePath}` : ''
          }${fileName ? `&fileName=${fileName}` : ''}`,
          auth()
        );
        return Promise.resolve();
      } catch (error) {
        return handleError(error);
      }
    },
    async editContent({
      contentId,
      editedComment,
      editedDescription,
      editedSecretAnswer,
      editedTitle,
      editedUrl,
      contentType
    }) {
      try {
        const { data } = await request.put(
          `${URL}/content`,
          {
            contentId,
            editedComment,
            editedDescription,
            editedSecretAnswer,
            editedTitle,
            editedUrl,
            contentType
          },
          auth()
        );
        return Promise.resolve(data);
      } catch (error) {
        return handleError(error);
      }
    },
    async editPlaylistTitle(params) {
      try {
        const {
          data: { title }
        } = await request.put(`${URL}/playlist/title`, params, auth());
        return Promise.resolve(title);
      } catch (error) {
        return handleError(error);
      }
    },
    async editPlaylistVideos({ addedVideoIds, removedVideoIds, playlistId }) {
      try {
        const { data: playlist } = await request.put(
          `${URL}/playlist/videos`,
          { addedVideoIds, removedVideoIds, playlistId },
          auth()
        );
        return Promise.resolve(playlist);
      } catch (error) {
        return handleError(error);
      }
    },
    async editSubject({
      subjectId,
      editedTitle,
      editedDescription,
      editedSecretAnswer
    }) {
      try {
        const { data } = await request.put(
          `${URL}/content/subjects`,
          { subjectId, editedTitle, editedDescription, editedSecretAnswer },
          auth()
        );
        return Promise.resolve(data);
      } catch (error) {
        return handleError(error);
      }
    },
    async fetchPlaylistsContaining({ videoId }) {
      try {
        const { data: playlists } = await request.get(
          `${URL}/playlist/containing?videoId=${videoId}`
        );
        return Promise.resolve(playlists);
      } catch (error) {
        return handleError(error);
      }
    },
    async fetchUrlEmbedData(url) {
      try {
        const { data } = await request.get(`${URL}/content/embed?url=${url}`);
        return Promise.resolve(data);
      } catch (error) {
        return handleError(error);
      }
    },
    async likeContent({ id, contentType }) {
      try {
        const {
          data: { likes }
        } = await request.post(
          `${URL}/content/like`,
          { id, contentType },
          auth()
        );
        return Promise.resolve(likes);
      } catch (error) {
        return handleError(error);
      }
    },
    async loadComments({
      contentId,
      contentType,
      lastCommentId,
      limit,
      isPreview
    }) {
      try {
        const {
          data: { comments, loadMoreButton }
        } = await request.get(
          `${URL}/content/comments?contentId=${contentId}&contentType=${contentType}&lastCommentId=${lastCommentId}&limit=${limit}${
            isPreview ? '&isPreview=1' : ''
          }`
        );
        return Promise.resolve({ comments, loadMoreButton });
      } catch (error) {
        return handleError(error);
      }
    },
    async loadContent({ contentId, contentType }) {
      try {
        const { data } = await request.get(
          `${URL}/content?contentId=${contentId}&contentType=${contentType}`
        );
        return Promise.resolve(data);
      } catch (error) {
        return handleError(error);
      }
    },
    async loadFeaturedPlaylists() {
      try {
        const { data } = await request.get(
          `${URL}/content/featured/playlists`,
          auth()
        );
        return Promise.resolve(data);
      } catch (error) {
        return handleError(error);
      }
    },
    async loadFeaturedSubjects() {
      try {
        const { data } = await request.get(`${URL}/content/featured/subjects`);
        return Promise.resolve(data);
      } catch (error) {
        return handleError(error);
      }
    },
    async loadFeeds({
      lastFeedId,
      lastTimeStamp,
      lastRewardLevel,
      lastViewDuration,
      mustInclude,
      filter = 'all',
      order = 'desc',
      orderBy = 'lastInteraction',
      username
    } = {}) {
      try {
        const { data } = await request.get(
          `${URL}/content/feeds?filter=${filter}&username=${username}&order=${order}&orderByLabel=${orderBy}${
            mustInclude ? `&mustInclude=${mustInclude}` : ''
          }${
            lastFeedId
              ? `&lastFeedId=${lastFeedId}&lastTimeStamp=${lastTimeStamp}&lastRewardLevel=${lastRewardLevel}&lastViewDuration=${lastViewDuration}`
              : ''
          }`,
          auth()
        );
        return Promise.resolve({ data, filter });
      } catch (error) {
        return handleError(error);
      }
    },
    async loadMorePlaylistList(playlistId) {
      try {
        const { data } = await request.get(
          `${URL}/playlist/list?playlistId=${playlistId}`
        );
        return Promise.resolve(data);
      } catch (error) {
        return handleError(error);
      }
    },
    async loadMoreNotableContents({ userId, notables }) {
      try {
        const {
          data: { results, loadMoreButton }
        } = await request.get(
          `${URL}/content/noteworthy?userId=${userId}&limit=2&${queryStringForArray(
            {
              array: notables,
              originVar: 'feedId',
              destinationVar: 'shownFeeds'
            }
          )}`
        );
        return Promise.resolve({ results, loadMoreButton });
      } catch (error) {
        return handleError(error);
      }
    },
    async loadNotableContent({ userId }) {
      try {
        const {
          data: { results, loadMoreButton }
        } = await request.get(
          `${URL}/content/noteworthy?userId=${userId}&limit=1`
        );
        return Promise.resolve({ results, loadMoreButton });
      } catch (error) {
        return handleError(error);
      }
    },
    async loadNewFeeds({ lastInteraction }) {
      try {
        const { data } = await request.get(
          `${URL}/content/newFeeds?lastInteraction=${lastInteraction}`
        );
        return Promise.resolve(data);
      } catch (error) {
        return handleError(error);
      }
    },
    async loadPlaylistList(playlistId) {
      try {
        const { data } = await request.get(
          `${URL}/playlist/list${playlistId ? `?playlistId=${playlistId}` : ''}`
        );
        return Promise.resolve(data);
      } catch (error) {
        return handleError(error);
      }
    },
    async loadPlaylists({ shownPlaylists } = {}) {
      try {
        const {
          data: { results, loadMoreButton }
        } = await request.get(
          `${URL}/playlist${
            shownPlaylists
              ? `/?${queryStringForArray({
                  array: shownPlaylists,
                  originVar: 'id',
                  destinationVar: 'shownPlaylists'
                })}`
              : ''
          }`,
          auth()
        );
        return Promise.resolve({ results, loadMoreButton });
      } catch (error) {
        return handleError(error);
      }
    },
    async loadPlaylistVideos({ limit, shownVideos, targetVideos, playlistId }) {
      try {
        const {
          data: { title, videos, loadMoreButton }
        } = await request.get(
          `${URL}/playlist/playlist?playlistId=${playlistId}${
            shownVideos
              ? '&' +
                queryStringForArray({
                  array: shownVideos,
                  originVar: 'id',
                  destinationVar: 'shownVideos'
                })
              : ''
          }${
            targetVideos
              ? '&' +
                queryStringForArray({
                  array: targetVideos,
                  originVar: 'id',
                  destinationVar: 'targetVideos'
                })
              : ''
          }&limit=${limit}`
        );
        return Promise.resolve({ title, results: videos, loadMoreButton });
      } catch (error) {
        return handleError(error);
      }
    },
    async loadReplies({ lastReplyId, commentId }) {
      try {
        const { data } = await request.get(
          `${URL}/content/replies?${
            lastReplyId ? `lastReplyId=${lastReplyId}&` : ''
          }commentId=${commentId}`
        );
        return Promise.resolve(data);
      } catch (error) {
        return handleError(error);
      }
    },
    async loadRightMenuVideos({ playlistId, videoId }) {
      try {
        const { data } = await request.get(
          `${URL}/${
            playlistId ? 'playlist' : 'video'
          }/rightMenu?videoId=${videoId}${
            playlistId ? `&playlistId=${playlistId}` : ''
          }`,
          auth()
        );
        return Promise.resolve(data);
      } catch (error) {
        return handleError(error);
      }
    },
    async loadSubjects({ contentType, contentId, lastSubjectId }) {
      try {
        const {
          data: { results, loadMoreButton }
        } = await request.get(
          `${URL}/content/subjects?contentId=${contentId}&contentType=${contentType}&lastSubjectId=${lastSubjectId}`
        );
        return Promise.resolve({ results, loadMoreButton });
      } catch (error) {
        return handleError(error);
      }
    },
    async loadByUserUploads({ contentType, lastId, limit }) {
      try {
        const {
          data: { results, loadMoreButton }
        } = await request.get(
          `${URL}/content/uploads/byUser?numberToLoad=${limit}&contentType=${contentType}${
            lastId ? `&lastId=${lastId}` : ''
          }`
        );
        return Promise.resolve({ results, loadMoreButton });
      } catch (error) {
        return handleError(error);
      }
    },
    async loadRecommendedUploads({
      limit,
      lastRecommendationId,
      lastInteraction,
      contentType
    }) {
      try {
        const {
          data: { results, loadMoreButton }
        } = await request.get(
          `${URL}/content/uploads/recommended?numberToLoad=${limit}&contentType=${contentType}${
            lastRecommendationId
              ? `&lastRecommendationId=${lastRecommendationId}&lastInteraction=${lastInteraction}`
              : ''
          }`
        );
        return Promise.resolve({ results, loadMoreButton });
      } catch (error) {
        return handleError(error);
      }
    },
    async loadUploads({
      limit,
      contentId,
      includeRoot,
      excludeContentIds = [],
      contentType
    }) {
      try {
        const {
          data: { results, loadMoreButton }
        } = await request.get(
          `${URL}/content/uploads?numberToLoad=${limit}&contentType=${contentType}&contentId=${contentId}${
            excludeContentIds.length > 0
              ? `&${queryStringForArray({
                  array: excludeContentIds,
                  destinationVar: 'excludes'
                })}`
              : ''
          }${includeRoot ? '&includeRoot=true' : ''}`
        );
        return Promise.resolve({ results, loadMoreButton });
      } catch (error) {
        return handleError(error);
      }
    },
    async makeThumbnailSecure({ contentId, contentType, thumbUrl }) {
      try {
        const { data } = await request.put(
          `${URL}/content/thumb/secure`,
          { contentId, contentType, thumbUrl },
          auth()
        );
        return Promise.resolve(data);
      } catch (error) {
        return handleError(error);
      }
    },
    async recommendContent({
      contentId,
      contentType,
      currentRecommendations,
      uploaderId
    }) {
      try {
        const {
          data: { coins, recommendations }
        } = await request.post(
          `${URL}/content/recommend`,
          { contentId, contentType, currentRecommendations, uploaderId },
          auth()
        );
        return Promise.resolve({ coins, recommendations });
      } catch (error) {
        return handleError(error);
      }
    },
    async reorderPlaylistVideos({
      originalVideoIds,
      reorderedVideoIds,
      playlistId
    }) {
      try {
        const { data: playlist } = await request.put(
          `${URL}/playlist/videos`,
          { originalVideoIds, reorderedVideoIds, playlistId },
          auth()
        );
        return Promise.resolve(playlist);
      } catch (error) {
        return handleError(error);
      }
    },
    async searchContent({ filter, limit, searchText, shownResults }) {
      try {
        const { data } = await request.get(
          `${URL}/content/search?filter=${filter}&limit=${limit}&searchText=${searchText}${
            shownResults
              ? `&${queryStringForArray({
                  array: shownResults,
                  originVar: 'id',
                  destinationVar: 'shownResults'
                })}`
              : ''
          }`
        );
        return Promise.resolve(data);
      } catch (error) {
        return handleError(error);
      }
    },
    async setByUser({ contentType, contentId }) {
      try {
        const {
          data: { byUser, cannotChange, moderatorName }
        } = await request.put(
          `${URL}/content/byUser`,
          { contentType, contentId },
          auth()
        );
        return Promise.resolve({ byUser, cannotChange, moderatorName });
      } catch (error) {
        return handleError(error);
      }
    },
    async updateRewardLevel({ rewardLevel, contentId, contentType }) {
      try {
        await request.put(
          `${URL}/content/rewardLevel`,
          { rewardLevel, contentId, contentType },
          auth()
        );
        return Promise.resolve();
      } catch (error) {
        return handleError(error);
      }
    },
    async checkCurrentlyWatchingAnotherVideo({ rewardLevel, watchCode }) {
      try {
        const {
          data: { currentlyWatchingAnotherVideo }
        } = await request.get(
          `${URL}/video/currentlyWatching?watchCode=${watchCode}&rewardLevel=${rewardLevel}`,
          auth()
        );
        return Promise.resolve(currentlyWatchingAnotherVideo);
      } catch (error) {
        return handleError(error);
      }
    },
    async updateTotalViewDuration({ videoId }) {
      try {
        await request.put(
          `${URL}/video/duration`,
          {
            videoId
          },
          auth()
        );
        return Promise.resolve();
      } catch (error) {
        return handleError(error);
      }
    },
    async updateVideoXPEarned(videoId) {
      try {
        await request.put(`${URL}/video/xpEarned`, { videoId }, auth());
        return Promise.resolve();
      } catch (error) {
        return handleError(error);
      }
    },
    async uploadComment({
      content,
      parent,
      rootCommentId,
      subjectId,
      targetCommentId,
      attachment,
      filePath,
      fileName,
      fileSize,
      isNotification
    }) {
      try {
        const { data } = await request.post(
          `${URL}/content/comments`,
          {
            content,
            parent,
            rootCommentId,
            subjectId,
            targetCommentId,
            attachment,
            filePath,
            fileName,
            fileSize,
            isNotification
          },
          auth()
        );
        return Promise.resolve(data);
      } catch (error) {
        return handleError(error);
      }
    },
    async uploadContent({
      attachment,
      url,
      isVideo,
      title,
      description,
      fileName,
      filePath,
      fileSize,
      rewardLevel,
      secretAnswer,
      ytDetails
    }) {
      try {
        const { data } = await request.post(
          `${URL}/content`,
          {
            attachment,
            url,
            isVideo,
            title,
            description,
            fileName,
            filePath,
            fileSize,
            rewardLevel,
            secretAnswer,
            ytDetails
          },
          auth()
        );
        return Promise.resolve(data);
      } catch (error) {
        return handleError(error);
      }
    },
    async uploadFeaturedPlaylists({ selectedPlaylists }) {
      try {
        const {
          data: { playlists }
        } = await request.post(
          `${URL}/playlist/pinned`,
          { selectedPlaylists },
          auth()
        );
        return Promise.resolve(playlists);
      } catch (error) {
        return handleError(error);
      }
    },
    async uploadFeaturedSubjects({ selected }) {
      try {
        const { data: subjects } = await request.post(
          `${URL}/content/featured/subjects`,
          { selectedSubjects: selected },
          auth()
        );
        return Promise.resolve(subjects);
      } catch (error) {
        return handleError(error);
      }
    },
    async uploadQuestions({ questions, videoId }) {
      const data = {
        videoId,
        questions: questions.map((question) => {
          const choices = question.choiceIds
            .map((id) => ({ id, label: question.choicesObj[id] }))
            .filter((choice) => choice.label && !stringIsEmpty(choice.label));
          return {
            videoId,
            title: question.title,
            correctChoice:
              choices
                .map((choice) => choice.id)
                .indexOf(question.correctChoice) + 1,
            choice1: choices[0].label,
            choice2: choices[1].label,
            choice3: choices[2]?.label,
            choice4: choices[3]?.label,
            choice5: choices[4]?.label
          };
        })
      };
      try {
        await request.post(`${URL}/video/questions`, data, auth());
        const questions = data.questions.map((question) => {
          return {
            title: question.title,
            choices: [
              question.choice1,
              question.choice2,
              question.choice3,
              question.choice4,
              question.choice5
            ],
            correctChoice: question.correctChoice
          };
        });
        return Promise.resolve(questions);
      } catch (error) {
        handleError(error);
      }
    },
    async uploadFile({ context = 'feed', filePath, file, onUploadProgress }) {
      const { data: url } = await request.get(
        `${URL}/content/sign-s3?fileSize=${
          file.size
        }&fileName=${encodeURIComponent(
          file.name
        )}&path=${filePath}&context=${context}`,
        auth()
      );
      await request.put(url.signedRequest, file, {
        onUploadProgress
      });
      return Promise.resolve(url?.url?.split('.com')?.[1]);
    },
    async uploadPlaylist({ title, description, selectedVideos }) {
      try {
        const {
          data: { result }
        } = await request.post(
          `${URL}/playlist`,
          { title, description, selectedVideos },
          auth()
        );
        return Promise.resolve(result);
      } catch (error) {
        return handleError(error);
      }
    },
    async uploadSubject({
      contentType,
      contentId,
      title,
      description,
      rewardLevel,
      secretAnswer
    }) {
      try {
        const { data } = await request.post(
          `${URL}/content/subjects`,
          {
            title,
            description,
            contentId,
            rewardLevel,
            secretAnswer,
            contentType
          },
          auth()
        );
        return Promise.resolve(data);
      } catch (error) {
        return handleError(error);
      }
    },
    async uploadThumb({ contentId, contentType, file, path }) {
      const { data: url } = await request.post(`${URL}/content/thumb`, {
        fileSize: file.size,
        path
      });
      await request.put(url.signedRequest, file);
      const {
        data: { thumbUrl }
      } = await request.put(`${URL}/content/thumb`, {
        path,
        contentId,
        contentType
      });
      return Promise.resolve(thumbUrl);
    }
  };
}
