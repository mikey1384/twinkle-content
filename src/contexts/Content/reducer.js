import {
  DEFAULT_PROFILE_THEME,
  defaultContentState
} from 'constants/defaultValues';

export default function ContentReducer(state, action) {
  const contentKey =
    action.contentType && action.contentId
      ? action.contentType + action.contentId
      : 'temp';
  const defaultState = {
    contentType: action.contentType,
    contentId: action.contentId,
    ...defaultContentState
  };
  const prevContentState = state[contentKey] || defaultState;
  switch (action.type) {
    case 'INIT_CONTENT':
      return {
        ...state,
        [contentKey]: {
          ...prevContentState,
          ...action.data,
          profileTheme: action.data.profileTheme || DEFAULT_PROFILE_THEME,
          loaded: true,
          contentId: action.contentId,
          contentType: action.contentType
        }
      };
    case 'ADD_TAGS':
      return {
        ...state,
        [contentKey]: {
          ...prevContentState,
          tags: prevContentState.tags.concat(action.tags)
        }
      };
    case 'ADD_TAG_TO_CONTENTS': {
      const newState = { ...state };
      const contentKeys = Object.keys(newState);
      for (let contentKey of contentKeys) {
        const prevContentState = newState[contentKey];
        newState[contentKey] = {
          ...prevContentState,
          tags:
            prevContentState.contentType === action.contentType &&
            action.contentIds.includes(prevContentState.contentId)
              ? (prevContentState.tags || []).concat({
                  id: action.tagId,
                  title: action.tagTitle
                })
              : prevContentState.tags
        };
      }
      return newState;
    }
    case 'ATTACH_REWARD': {
      const newState = { ...state };
      const contentKeys = Object.keys(newState);
      for (let contentKey of contentKeys) {
        const prevContentState = newState[contentKey];
        const contentMatches =
          prevContentState.contentId === action.contentId &&
          prevContentState.contentType === action.contentType;
        newState[contentKey] = {
          ...prevContentState,
          rewards: contentMatches
            ? (prevContentState.rewards || []).concat(action.reward)
            : prevContentState.rewards,
          comments:
            action.contentType === 'comment'
              ? prevContentState.comments?.map((comment) => {
                  const commentMatches = comment.id === action.contentId;
                  return {
                    ...comment,
                    rewards: commentMatches
                      ? (comment.rewards || []).concat(action.reward)
                      : comment.rewards,
                    replies: (comment.replies || []).map((reply) => {
                      const replyMatches = reply.id === action.contentId;
                      return {
                        ...reply,
                        rewards: replyMatches
                          ? (reply.rewards || []).concat(action.reward)
                          : reply.rewards
                      };
                    })
                  };
                })
              : prevContentState.comments,
          subjects: prevContentState.subjects?.map((subject) => {
            const subjectMatches =
              subject.id === action.contentId &&
              action.contentType === 'subject';
            return {
              ...subject,
              rewards: subjectMatches
                ? (subject.rewards || []).concat(action.reward)
                : subject.rewards,
              comments:
                action.contentType === 'comment'
                  ? subject.comments.map((comment) => {
                      const commentMatches = comment.id === action.contentId;
                      return {
                        ...comment,
                        rewards: commentMatches
                          ? (comment.rewards || []).concat(action.reward)
                          : comment.rewards,
                        replies: (comment.replies || []).map((reply) => {
                          const replyMatches = reply.id === action.contentId;
                          return {
                            ...reply,
                            rewards: replyMatches
                              ? (reply.rewards || []).concat(action.reward)
                              : reply.rewards
                          };
                        })
                      };
                    })
                  : subject.comments
            };
          }),
          targetObj: prevContentState.targetObj
            ? {
                ...prevContentState.targetObj,
                comment: prevContentState.targetObj.comment
                  ? {
                      ...prevContentState.targetObj.comment,
                      rewards:
                        prevContentState.targetObj.comment.id ===
                          action.contentId && action.contentType === 'comment'
                          ? (
                              prevContentState.targetObj.comment.rewards || []
                            ).concat(action.reward)
                          : prevContentState.targetObj.comment.rewards
                    }
                  : undefined,
                subject: prevContentState.targetObj.subject
                  ? {
                      ...prevContentState.targetObj.subject,
                      rewards:
                        prevContentState.targetObj.subject.id ===
                          action.contentId && action.contentType === 'subject'
                          ? (
                              prevContentState.targetObj.subject.rewards || []
                            ).concat(action.reward)
                          : prevContentState.targetObj.subject.rewards
                    }
                  : undefined
              }
            : undefined
        };
      }
      return newState;
    }
    case 'CLEAR_COMMENT_FILE_UPLOAD_PROGRESS':
      return {
        ...state,
        [contentKey]: {
          ...prevContentState,
          fileUploadProgress: null,
          fileUploadComplete: false
        }
      };
    case 'CHANGE_PROFILE_THEME':
      return {
        ...state,
        [contentKey]: {
          ...prevContentState,
          profileTheme: action.theme
        }
      };
    case 'CHANGE_SPOILER_STATUS': {
      const newState = { ...state };
      const contentKeys = Object.keys(newState);
      for (let contentKey of contentKeys) {
        const prevContentState = newState[contentKey];
        const contentMatches =
          prevContentState.contentId === action.contentId &&
          prevContentState.contentType === action.contentType;
        const targetSubjectMatches =
          prevContentState.targetObj?.subject?.id === action.contentId;
        newState[contentKey] = {
          ...prevContentState,
          ...(contentMatches || targetSubjectMatches
            ? {
                prevSecretViewerId: action.prevSecretViewerId,
                secretShown: action.shown
              }
            : {}),
          targetObj: prevContentState.targetObj
            ? {
                ...prevContentState.targetObj,
                subject: prevContentState.targetObj.subject
                  ? targetSubjectMatches
                    ? {
                        ...prevContentState.targetObj.subject,
                        secretShown: action.shown
                      }
                    : prevContentState.targetObj.subject
                  : undefined
              }
            : undefined
        };
      }
      if (!newState['subject' + action.contentId]) {
        newState['subject' + action.contentId] = {
          ...defaultState,
          contentType: 'subject',
          contentId: action.contentId,
          prevSecretViewerId: action.prevSecretViewerId,
          secretShown: action.shown
        };
      }
      return newState;
    }
    case 'CHANGE_USER_COINS':
      return {
        ...state,
        [contentKey]: {
          ...prevContentState,
          twinkleCoins: action.coins
        }
      };
    case 'CHANGE_USER_XP':
      return {
        ...state,
        [contentKey]: {
          ...prevContentState,
          twinkleXP: action.xp,
          rank: action.rank
        }
      };
    case 'DELETE_COMMENT': {
      const newState = { ...state };
      const contentKeys = Object.keys(newState);
      for (let contentKey of contentKeys) {
        const prevContentState = newState[contentKey];
        newState[contentKey] = {
          ...prevContentState,
          deleted:
            prevContentState.deleted ||
            (prevContentState.contentId === action.commentId &&
              prevContentState.contentType === 'comment'),
          comments: prevContentState.comments?.map((comment) =>
            comment.id === action.commentId
              ? { ...comment, deleted: true }
              : {
                  ...comment,
                  replies: (comment.replies || []).map((reply) =>
                    reply.id === action.commentId
                      ? { ...reply, deleted: true }
                      : reply
                  )
                }
          ),
          subjects: prevContentState.subjects?.map((subject) => ({
            ...subject,
            comments: subject.comments?.map((comment) =>
              comment.id === action.commentId
                ? { ...comment, deleted: true }
                : {
                    ...comment,
                    replies: (comment.replies || []).map((reply) =>
                      reply.id === action.commentId
                        ? { ...reply, deleted: true }
                        : reply
                    )
                  }
            )
          })),
          targetObj: prevContentState.targetObj
            ? {
                ...prevContentState.targetObj,
                comment: prevContentState.targetObj.comment
                  ? {
                      ...prevContentState.targetObj.comment,
                      deleted:
                        prevContentState.targetObj.comment.id ===
                        action.commentId,
                      comments: prevContentState.targetObj.comment.comments?.map(
                        (comment) =>
                          comment.id === action.commentId
                            ? { ...comment, deleted: true }
                            : comment
                      )
                    }
                  : undefined
              }
            : undefined
        };
      }
      return newState;
    }
    case 'DELETE_CONTENT':
      return {
        ...state,
        [contentKey]: {
          ...prevContentState,
          deleted: true
        }
      };
    case 'DELETE_STATUS_MSG': {
      return {
        ...state,
        [contentKey]: {
          ...prevContentState,
          statusMsg: '',
          statusColor: ''
        }
      };
    }
    case 'DELETE_SUBJECT': {
      const newState = { ...state };
      const contentKeys = Object.keys(newState);
      for (let contentKey of contentKeys) {
        const prevContentState = newState[contentKey];
        newState[contentKey] = {
          ...prevContentState,
          subjects: prevContentState.subjects?.filter(
            (subject) => subject.id !== action.subjectId
          )
        };
      }
      return newState;
    }
    case 'EDIT_COMMENT': {
      const newState = { ...state };
      const contentKeys = Object.keys(newState);
      for (let contentKey of contentKeys) {
        const prevContentState = newState[contentKey];
        newState[contentKey] = {
          ...prevContentState,
          content:
            prevContentState.contentId === action.commentId
              ? action.editedComment
              : prevContentState.content,
          comments: prevContentState.comments.map((comment) => ({
            ...comment,
            content:
              comment.id === action.commentId
                ? action.editedComment
                : comment.content,
            replies: (comment.replies || []).map((reply) =>
              reply.id === action.commentId
                ? {
                    ...reply,
                    content: action.editedComment
                  }
                : reply
            )
          })),
          targetObj: prevContentState.targetObj
            ? {
                ...prevContentState.targetObj,
                comment: prevContentState.targetObj.comment
                  ? {
                      ...prevContentState.targetObj.comment,
                      comments: prevContentState.targetObj.comment.comments?.map(
                        (comment) =>
                          comment.id === action.commentId
                            ? {
                                ...comment,
                                content: action.editedComment
                              }
                            : comment
                      )
                    }
                  : undefined
              }
            : undefined,
          subjects: prevContentState.subjects?.map((subject) => ({
            ...subject,
            comments: subject.comments?.map((comment) => ({
              ...comment,
              content:
                comment.id === action.commentId
                  ? action.editedComment
                  : comment.content,
              replies: (comment.replies || []).map((reply) =>
                reply.id === action.commentId
                  ? {
                      ...reply,
                      content: action.editedComment
                    }
                  : reply
              )
            }))
          }))
        };
      }
      return newState;
    }
    case 'EDIT_CONTENT': {
      const newState = { ...state };
      const contentKeys = Object.keys(newState);
      for (let contentKey of contentKeys) {
        const prevContentState = newState[contentKey];
        const contentMatches =
          prevContentState.contentId === action.contentId &&
          prevContentState.contentType === action.contentType;
        newState[contentKey] = {
          ...prevContentState,
          ...(contentMatches ? action.data : {}),
          comments:
            action.contentType === 'comment'
              ? prevContentState.comments?.map((comment) => {
                  const commentMatches = comment.id === action.contentId;
                  return {
                    ...comment,
                    ...(commentMatches ? action.data : {}),
                    replies: (comment.replies || []).map((reply) => {
                      const replyMatches = reply.id === action.contentId;
                      return {
                        ...reply,
                        ...(replyMatches ? action.data : {})
                      };
                    })
                  };
                })
              : prevContentState.comments,
          subjects: prevContentState.subjects?.map((subject) => {
            const subjectMatches =
              subject.id === action.contentId &&
              action.contentType === 'subject';
            return {
              ...subject,
              ...(subjectMatches ? action.data : {}),
              comments:
                action.contentType === 'comment'
                  ? subject.comments.map((comment) => {
                      const commentMatches = comment.id === action.contentId;
                      return {
                        ...comment,
                        ...(commentMatches ? action.data : {}),
                        replies: (comment.replies || []).map((reply) => {
                          const replyMatches = reply.id === action.contentId;
                          return {
                            ...reply,
                            ...(replyMatches ? action.data : {})
                          };
                        })
                      };
                    })
                  : subject.comments
            };
          }),
          targetObj: prevContentState.targetObj
            ? {
                ...prevContentState.targetObj,
                comment: prevContentState.targetObj.comment
                  ? {
                      ...prevContentState.targetObj.comment,
                      ...(prevContentState.targetObj.comment.id ===
                        action.contentId && action.contentType === 'comment'
                        ? action.data
                        : {})
                    }
                  : undefined,
                subject: prevContentState.targetObj.subject
                  ? {
                      ...prevContentState.targetObj.subject,
                      ...(prevContentState.targetObj.subject.id ===
                        action.contentId && action.contentType === 'subject'
                        ? action.data
                        : {})
                    }
                  : undefined
              }
            : undefined
        };
      }
      return newState;
    }
    case 'EDIT_PROFILE_PICTURE': {
      return {
        ...state,
        [contentKey]: {
          ...prevContentState,
          profilePicId: action.imageId
        }
      };
    }
    case 'EDIT_REWARD_COMMENT': {
      const newState = { ...state };
      const contentKeys = Object.keys(newState);
      for (let contentKey of contentKeys) {
        const prevContentState = newState[contentKey];
        newState[contentKey] = {
          ...prevContentState,
          rewards: prevContentState.rewards?.map((reward) => ({
            ...reward,
            rewardComment:
              reward.id === action.id ? action.text : reward.rewardComment
          })),
          comments: prevContentState.comments?.map((comment) => ({
            ...comment,
            rewards: comment.rewards?.map((reward) => ({
              ...reward,
              rewardComment:
                reward.id === action.id ? action.text : reward.rewardComment
            })),
            replies: (comment.replies || []).map((reply) => ({
              ...reply,
              rewards: reply.rewards?.map((reward) => ({
                ...reward,
                rewardComment:
                  reward.id === action.id ? action.text : reward.rewardComment
              }))
            }))
          })),
          subjects: prevContentState.subjects?.map((subject) => ({
            ...subject,
            comments: subject.comments.map((comment) => ({
              ...comment,
              rewards: comment.rewards
                ? comment.rewards.map((reward) => ({
                    ...reward,
                    rewardComment:
                      reward.id === action.id
                        ? action.text
                        : reward.rewardComment
                  }))
                : [],
              replies: (comment.replies || []).map((reply) => ({
                ...reply,
                rewards: reply.rewards
                  ? reply.rewards.map((reward) => ({
                      ...reward,
                      rewardComment:
                        reward.id === action.id
                          ? action.text
                          : reward.rewardComment
                    }))
                  : []
              }))
            }))
          })),
          targetObj: prevContentState.targetObj
            ? {
                ...prevContentState.targetObj,
                comment: prevContentState.targetObj.comment
                  ? {
                      ...prevContentState.targetObj.comment,
                      rewards: prevContentState.targetObj.comment.rewards?.map(
                        (reward) => ({
                          ...reward,
                          rewardComment:
                            reward.id === action.id
                              ? action.text
                              : reward.rewardComment
                        })
                      )
                    }
                  : undefined
              }
            : undefined
        };
      }
      return newState;
    }
    case 'EDIT_SUBJECT': {
      const newState = { ...state };
      const contentKeys = Object.keys(newState);
      for (let contentKey of contentKeys) {
        const prevContentState = newState[contentKey];
        const contentMatches =
          prevContentState.contentId === action.subjectId &&
          prevContentState.contentType === 'subject';
        newState[contentKey] = {
          ...prevContentState,
          ...(contentMatches ? action.editedSubject : {}),
          subjects: prevContentState.subjects?.map((subject) =>
            subject.id === action.subjectId
              ? {
                  ...subject,
                  ...action.editedSubject
                }
              : subject
          )
        };
      }
      return newState;
    }
    case 'INCREASE_NUM_COINS_EARNED':
      return {
        ...state,
        [contentKey]: {
          ...prevContentState,
          numCoinsEarned: (prevContentState.numCoinsEarned || 0) + 2
        }
      };
    case 'LIKE_COMMENT': {
      const newState = { ...state };
      const contentKeys = Object.keys(newState);
      for (let contentKey of contentKeys) {
        const prevContentState = newState[contentKey];
        newState[contentKey] = {
          ...prevContentState,
          comments: prevContentState.comments.map((comment) => {
            return {
              ...comment,
              likes:
                comment.id === action.commentId ? action.likes : comment.likes,
              replies: (comment.replies || []).map((reply) => {
                return {
                  ...reply,
                  likes:
                    reply.id === action.commentId ? action.likes : reply.likes
                };
              })
            };
          }),
          subjects: prevContentState.subjects?.map((subject) => {
            return {
              ...subject,
              comments: subject.comments.map((comment) => {
                return {
                  ...comment,
                  likes:
                    comment.id === action.commentId
                      ? action.likes
                      : comment.likes,
                  replies: (comment.replies || []).map((reply) => {
                    return {
                      ...reply,
                      likes:
                        reply.id === action.commentId
                          ? action.likes
                          : reply.likes
                    };
                  })
                };
              })
            };
          })
        };
      }
      return newState;
    }
    case 'LIKE_CONTENT': {
      const newState = { ...state };
      const contentKeys = Object.keys(newState);
      for (let contentKey of contentKeys) {
        const prevContentState = newState[contentKey];
        newState[contentKey] = {
          ...prevContentState,
          likes:
            prevContentState.contentId === action.contentId &&
            prevContentState.contentType === action.contentType
              ? action.likes
              : prevContentState.likes,
          comments:
            action.contentType === 'comment'
              ? prevContentState.comments.map((comment) => ({
                  ...comment,
                  likes:
                    comment.id === action.contentId
                      ? action.likes
                      : comment.likes,
                  replies: (comment.replies || []).map((reply) => ({
                    ...reply,
                    likes:
                      reply.id === action.contentId
                        ? action.likes
                        : reply.likes,
                    replies: (reply.replies || []).map((reply) => ({
                      ...reply,
                      likes:
                        reply.id === action.contentId
                          ? action.likes
                          : reply.likes
                    }))
                  }))
                }))
              : prevContentState.comments,
          rootObj: prevContentState.rootObj
            ? {
                ...prevContentState.rootObj,
                likes:
                  prevContentState.rootId === action.contentId &&
                  prevContentState.rootType === action.contentType
                    ? action.likes
                    : prevContentState.rootObj.likes
              }
            : undefined,
          targetObj: prevContentState.targetObj
            ? {
                ...prevContentState.targetObj,
                [action.contentType]: prevContentState.targetObj[
                  action.contentType
                ]
                  ? {
                      ...prevContentState.targetObj[action.contentType],
                      likes:
                        prevContentState.targetObj[action.contentType].id ===
                        action.contentId
                          ? action.likes
                          : prevContentState.targetObj[action.contentType].likes
                    }
                  : undefined
              }
            : undefined
        };
      }
      return newState;
    }
    case 'LOAD_COMMENTS':
      return {
        ...state,
        [contentKey]: {
          ...prevContentState,
          commentsLoaded: !action.isPreview,
          previewLoaded: true,
          comments: action.comments,
          commentsLoadMoreButton: action.loadMoreButton
        }
      };
    case 'LOAD_MORE_COMMENTS': {
      return {
        ...state,
        [contentKey]: {
          ...prevContentState,
          comments:
            prevContentState.contentType === 'comment'
              ? (action.comments || []).concat(prevContentState.comments)
              : (prevContentState.comments || []).concat(action.comments),
          commentsLoadMoreButton: action.loadMoreButton
        }
      };
    }
    case 'LOAD_MORE_REPLIES':
      return {
        ...state,
        [contentKey]: {
          ...prevContentState,
          comments: prevContentState.comments.map((comment) => ({
            ...comment,
            replies:
              comment.id === action.commentId
                ? (action.replies || []).concat(comment.replies)
                : comment.replies,
            loadMoreButton:
              comment.id === action.commentId
                ? action.loadMoreButton
                : comment.loadMoreButton
          }))
        }
      };
    case 'LOAD_MORE_SUBJECT_COMMENTS':
      return {
        ...state,
        ['subject' + action.subjectId]: {
          ...state['subject' + action.subjectId],
          comments: state['subject' + action.subjectId].comments.concat(
            action.comments
          )
        },
        [contentKey]: {
          ...prevContentState,
          subjects: prevContentState.subjects?.map((subject) => {
            if (subject.id === action.subjectId) {
              return {
                ...subject,
                comments: subject.comments.concat(action.comments),
                loadMoreCommentsButton: action.loadMoreButton
              };
            }
            return subject;
          })
        }
      };
    case 'LOAD_MORE_SUBJECT_REPLIES':
      return {
        ...state,
        ['subject' + action.subjectId]: {
          ...state['subject' + action.subjectId],
          comments: state['subject' + action.subjectId].comments.map(
            (comment) => {
              return {
                ...comment,
                replies:
                  comment.id === action.commentId
                    ? action.replies.concat(comment.replies)
                    : comment.replies,
                loadMoreButton:
                  comment.id === action.commentId
                    ? action.loadMoreButton
                    : comment.loadMoreButton
              };
            }
          )
        },
        [contentKey]: {
          ...prevContentState,
          subjects: prevContentState.subjects?.map((subject) => {
            return {
              ...subject,
              comments: subject.comments.map((comment) => {
                return {
                  ...comment,
                  replies:
                    comment.id === action.commentId
                      ? action.replies.concat(comment.replies)
                      : comment.replies,
                  loadMoreButton:
                    comment.id === action.commentId
                      ? action.loadMoreButton
                      : comment.loadMoreButton
                };
              })
            };
          })
        }
      };
    case 'LOAD_MORE_SUBJECTS': {
      const subjectStates = {};
      for (let subject of action.results) {
        subjectStates['subject' + subject.id] = subject;
      }
      return {
        ...state,
        ...subjectStates,
        [contentKey]: {
          ...prevContentState,
          subjects: (prevContentState.subjects || []).concat(action.results),
          subjectsLoadMoreButton: action.loadMoreButton
        }
      };
    }
    case 'LOAD_REPLIES':
      return {
        ...state,
        [contentKey]: {
          ...prevContentState,
          comments: prevContentState.comments.map((comment) => {
            if (comment.id === action.commentId) {
              return {
                ...comment,
                numReplies: 0,
                replies: action.replies,
                loadMoreButton: action.loadMoreButton
              };
            }
            return comment;
          })
        }
      };
    case 'LOAD_REPLIES_OF_REPLY':
      return {
        ...state,
        [contentKey]: {
          ...prevContentState,
          comments: prevContentState.comments.map((comment) => {
            if (comment.id === action.commentId) {
              return {
                ...comment,
                replies: [
                  ...(comment.replies || [])
                    .filter((reply) => reply.id <= action.replyId)
                    .map((reply) =>
                      reply.id === action.replyId
                        ? {
                            ...reply,
                            numReplies: 0
                          }
                        : reply
                    ),
                  ...action.replies,
                  ...(comment.replies || []).filter(
                    (reply) => reply.id > action.replyId
                  )
                ]
              };
            }
            let containsRootReply = false;
            for (let reply of comment.replies || []) {
              if (reply.id === action.replyId) {
                containsRootReply = true;
                break;
              }
            }
            if (containsRootReply) {
              const replies = (comment.replies || []).filter(
                (reply) => reply.id <= action.replyId
              );
              replies[replies.length - 1] = {
                ...replies[replies.length - 1],
                numReplies: 0
              };
              return {
                ...comment,
                replies: [
                  ...replies.map((reply) =>
                    reply.id === action.replyId
                      ? {
                          ...reply,
                          numReplies: 0
                        }
                      : reply
                  ),
                  ...action.replies,
                  ...(comment.replies || []).filter(
                    (reply) => reply.id > action.replyId
                  )
                ]
              };
            }
            return comment;
          })
        }
      };
    case 'LOAD_SUBJECT_REPLIES_OF_REPLY':
      return {
        ...state,
        [contentKey]: {
          ...prevContentState,
          subjects: prevContentState.subjects?.map((subject) => {
            return {
              ...subject,
              comments: subject.comments.map((comment) => {
                if (comment.id === action.commentId) {
                  return {
                    ...comment,
                    replies: [
                      ...(comment.replies || [])
                        .filter((reply) => reply.id <= action.replyId)
                        .map((reply) =>
                          reply.id === action.replyId
                            ? {
                                ...reply,
                                numReplies: 0
                              }
                            : reply
                        ),
                      ...action.replies,
                      ...(comment.replies || []).filter(
                        (reply) => reply.id > action.replyId
                      )
                    ]
                  };
                }
                let containsRootReply = false;
                for (let reply of comment.replies || []) {
                  if (reply.id === action.replyId) {
                    containsRootReply = true;
                    break;
                  }
                }
                if (containsRootReply) {
                  const replies = (comment.replies || []).filter(
                    (reply) => reply.id <= action.replyId
                  );
                  replies[replies.length - 1] = {
                    ...replies[replies.length - 1],
                    numReplies: 0
                  };
                  return {
                    ...comment,
                    replies: [
                      ...replies.map((reply) =>
                        reply.id === action.replyId
                          ? {
                              ...reply,
                              numReplies: 0
                            }
                          : reply
                      ),
                      ...action.replies,
                      ...(comment.replies || []).filter(
                        (reply) => reply.id > action.replyId
                      )
                    ]
                  };
                }
                return comment;
              })
            };
          })
        }
      };
    case 'LOAD_SUBJECTS': {
      const subjectStates = {};
      for (let subject of action.subjects) {
        subjectStates['subject' + subject.id] = subject;
      }
      return {
        ...state,
        ...subjectStates,
        [contentKey]: {
          ...prevContentState,
          subjectsLoaded: true,
          subjects: action.subjects,
          subjectsLoadMoreButton: action.loadMoreButton
        }
      };
    }
    case 'LOAD_SUBJECT_COMMENTS':
      return {
        ...state,
        ['subject' + action.subjectId]: {
          ...state['subject' + action.subjectId],
          comments: action.comments,
          loadMoreCommentsButton: action.loadMoreButton
        },
        [contentKey]: {
          ...prevContentState,
          subjects: prevContentState.subjects?.map((subject) => {
            if (subject.id === action.subjectId) {
              return {
                ...subject,
                comments: action.comments,
                loadMoreCommentsButton: action.loadMoreButton
              };
            }
            return subject;
          })
        }
      };
    case 'LOAD_TAGS':
      return {
        ...state,
        [contentKey]: {
          ...prevContentState,
          tags: action.tags
        }
      };
    case 'RECOMMEND_CONTENT': {
      const newState = { ...state };
      const contentKeys = Object.keys(newState);
      for (let contentKey of contentKeys) {
        const prevContentState = newState[contentKey];
        newState[contentKey] = {
          ...prevContentState,
          recommendations:
            prevContentState.contentId === action.contentId &&
            prevContentState.contentType === action.contentType
              ? action.recommendations
              : prevContentState.recommendations,
          comments:
            action.contentType === 'comment'
              ? prevContentState.comments.map((comment) => ({
                  ...comment,
                  recommendations:
                    comment.id === action.contentId
                      ? action.recommendations
                      : comment.recommendations,
                  replies: (comment.replies || []).map((reply) => ({
                    ...reply,
                    recommendations:
                      reply.id === action.contentId
                        ? action.recommendations
                        : reply.recommendations,
                    replies: (reply.replies || []).map((reply) => ({
                      ...reply,
                      recommendations:
                        reply.id === action.contentId
                          ? action.recommendations
                          : reply.recommendations
                    }))
                  }))
                }))
              : prevContentState.comments,
          rootObj: prevContentState.rootObj
            ? {
                ...prevContentState.rootObj,
                recommendations:
                  prevContentState.rootId === action.contentId &&
                  prevContentState.rootType === action.contentType
                    ? action.recommendations
                    : prevContentState.rootObj.recommendations
              }
            : undefined,
          targetObj: prevContentState.targetObj
            ? {
                ...prevContentState.targetObj,
                [action.contentType]: prevContentState.targetObj[
                  action.contentType
                ]
                  ? {
                      ...prevContentState.targetObj[action.contentType],
                      recommendations:
                        prevContentState.targetObj[action.contentType].id ===
                        action.contentId
                          ? action.recommendations
                          : prevContentState.targetObj[action.contentType]
                              .recommendations
                    }
                  : undefined
              }
            : undefined
        };
      }
      return newState;
    }
    case 'RECOMMEND_SUBJECT': {
      const newState = { ...state };
      const contentKeys = Object.keys(newState);
      for (let contentKey of contentKeys) {
        const prevContentState = newState[contentKey];
        newState[contentKey] = {
          ...prevContentState,
          subjects: prevContentState.subjects?.map((subject) =>
            subject.id === action.subjectId
              ? {
                  ...subject,
                  recommendations: action.recommendations
                }
              : subject
          )
        };
      }
      return newState;
    }
    case 'RELOAD_CONTENT':
      return {
        ...state,
        [contentKey]: {
          ...prevContentState,
          commentsLoaded: false,
          loaded: false
        }
      };
    case 'SET_ACTUAL_URL_DESCRIPTION':
      return {
        ...state,
        [contentKey]: {
          ...prevContentState,
          [action.contentType === 'url'
            ? 'actualDescription'
            : 'linkDescription']: action.description
        }
      };
    case 'SET_ACTUAL_URL_TITLE':
      return {
        ...state,
        [contentKey]: {
          ...prevContentState,
          [action.contentType === 'url'
            ? 'actualTitle'
            : 'linkTitle']: action.title
        }
      };
    case 'SET_CHAT_INVITATION_DETAIL':
      return {
        ...state,
        [contentKey]: {
          ...prevContentState,
          invitationDetail: action.detail
        }
      };
    case 'SET_BY_USER_STATUS':
      return {
        ...state,
        [contentKey]: {
          ...prevContentState,
          byUser: action.byUser,
          rootObj: prevContentState.rootObj
            ? { ...prevContentState.rootObj, byUser: action.byUser }
            : undefined
        }
      };
    case 'SET_COMMENT_FILE_UPLOAD_COMPLETE':
      return {
        ...state,
        [contentKey]: {
          ...prevContentState,
          fileUploadComplete: true
        }
      };
    case 'SET_COMMENTS_SHOWN':
      return {
        ...state,
        [contentKey]: {
          ...prevContentState,
          commentsShown: true
        }
      };
    case 'SET_COMMENT_UPLOADING_FILE':
      return {
        ...state,
        [contentKey]: {
          ...prevContentState,
          uploadingFile: action.uploading
        }
      };
    case 'SET_EMBEDDED_URL':
      return {
        ...state,
        [contentKey]: {
          ...prevContentState,
          embeddedUrl: action.url
        }
      };
    case 'SET_EXISTING_CONTENT':
      return {
        ...state,
        [contentKey]: {
          ...prevContentState,
          existingContent: action.content
        }
      };
    case 'SET_FULL_TEXT_STATE':
      return {
        ...state,
        [contentKey]: {
          ...prevContentState,
          fullTextState: {
            ...(prevContentState.fullTextState || {}),
            [action.section]: action.fullTextShown
          }
        }
      };
    case 'SET_IS_EDITING':
      return {
        ...state,
        [contentKey]: {
          ...prevContentState,
          isEditing: action.isEditing
        }
      };
    case 'SET_PLACEHOLDER_HEIGHT':
      return {
        ...state,
        [contentKey]: {
          ...prevContentState,
          placeholderHeight: action.height
        }
      };
    case 'SET_PREV_URL':
      return {
        ...state,
        [contentKey]: {
          ...prevContentState,
          prevUrl: action.prevUrl
        }
      };
    case 'SET_REWARD_LEVEL': {
      const newState = { ...state };
      const contentKeys = Object.keys(newState);
      for (let contentKey of contentKeys) {
        const prevContentState = newState[contentKey];
        const contentMatches =
          prevContentState.contentId === action.contentId &&
          prevContentState.contentType === action.contentType;
        const rootMatches =
          prevContentState.rootId === action.contentId &&
          prevContentState.rootType === action.contentType;
        newState[contentKey] = {
          ...prevContentState,
          rewardLevel: contentMatches
            ? action.rewardLevel
            : prevContentState.rewardLevel,
          subjects: prevContentState.subjects?.map((subject) => {
            const subjectMatches =
              subject.id === action.contentId &&
              action.contentType === 'subject';
            return {
              ...subject,
              rewardLevel: subjectMatches
                ? action.rewardLevel
                : subject.rewardLevel
            };
          }),
          rootObj: prevContentState.rootObj
            ? {
                ...prevContentState.rootObj,
                rewardLevel: rootMatches
                  ? action.rewardLevel
                  : prevContentState.rootObj.rewardLevel
              }
            : undefined,
          targetObj: prevContentState.targetObj
            ? {
                ...prevContentState.targetObj,
                subject: prevContentState.targetObj.subject
                  ? {
                      ...prevContentState.targetObj.subject,
                      rewardLevel:
                        prevContentState.targetObj.subject.id ===
                          action.contentId && action.contentType === 'subject'
                          ? action.rewardLevel
                          : prevContentState.targetObj.subject.rewardLevel
                    }
                  : undefined
              }
            : undefined
        };
      }
      return newState;
    }
    case 'SET_SITE_URL':
      return {
        ...state,
        [contentKey]: {
          ...prevContentState,
          [action.contentType === 'url' ? 'siteUrl' : 'linkUrl']: action.siteUrl
        }
      };
    case 'SET_SUBJECT_FORM_SHOWN':
      return {
        ...state,
        [contentKey]: {
          ...prevContentState,
          subjectFormShown: action.shown
        }
      };
    case 'SET_SUBJECT_REWARD_LEVEL':
      return {
        ...state,
        [contentKey]: {
          ...prevContentState,
          subjects: prevContentState.subjects?.map((subject) => {
            return subject.id === action.contentId
              ? {
                  ...subject,
                  rewardLevel: action.rewardLevel
                }
              : subject;
          })
        }
      };
    case 'SET_THUMB_URL':
      return {
        ...state,
        [contentKey]: {
          ...prevContentState,
          thumbUrl: action.thumbUrl
        }
      };
    case 'SET_USER_ONLINE':
      return {
        ...state,
        [contentKey]: {
          ...prevContentState,
          online: action.online
        }
      };
    case 'SET_VIDEO_CURRENT_TIME':
      return {
        ...state,
        [contentKey]: {
          ...prevContentState,
          currentTime: action.currentTime
        }
      };
    case 'SET_VIDEO_QUESTIONS':
      return {
        ...state,
        [contentKey]: {
          ...prevContentState,
          questions: action.questions
        }
      };
    case 'SET_VIDEO_STARTED':
      return {
        ...state,
        [contentKey]: {
          ...prevContentState,
          started: action.started
        }
      };
    case 'SET_VIDEO_COIN_PROGRESS':
      return {
        ...state,
        [contentKey]: {
          ...prevContentState,
          coinProgress: action.progress
        }
      };
    case 'SET_VIDEO_XP_EARNED':
      return {
        ...state,
        [contentKey]: {
          ...prevContentState,
          xpEarned: action.earned
        }
      };
    case 'SET_VIDEO_XP_JUST_EARNED':
      return {
        ...state,
        [contentKey]: {
          ...prevContentState,
          justEarned: action.justEarned
        }
      };
    case 'SET_VIDEO_XP_LOADED':
      return {
        ...state,
        [contentKey]: {
          ...prevContentState,
          xpLoaded: action.loaded
        }
      };
    case 'SET_VIDEO_XP_PROGRESS':
      return {
        ...state,
        [contentKey]: {
          ...prevContentState,
          xpProgress: action.progress
        }
      };
    case 'SET_VISIBLE':
      return {
        ...state,
        [contentKey]: {
          ...prevContentState,
          visible: action.visible
        }
      };
    case 'SET_XP_REWARD_INTERFACE_SHOWN':
      return {
        ...state,
        [contentKey]: {
          ...prevContentState,
          xpRewardInterfaceShown: action.shown
        }
      };
    case 'SET_XP_VIDEO_WATCH_TIME':
      return {
        ...state,
        [contentKey]: {
          ...prevContentState,
          watchTime: action.watchTime
        }
      };
    case 'SHOW_TC_REPLY_INPUT':
      return {
        ...state,
        [contentKey]: {
          ...prevContentState,
          targetObj: { ...prevContentState.targetObj, replyInputShown: true }
        }
      };
    case 'UPDATE_COMMENT_FILE_UPLOAD_PROGRESS':
      return {
        ...state,
        [contentKey]: {
          ...prevContentState,
          fileUploadProgress: action.progress
        }
      };
    case 'UPDATE_CURRENT_MISSION':
      return {
        ...state,
        [contentKey]: {
          ...prevContentState,
          currentMissionId: action.missionId
        }
      };
    case 'UPDATE_PROFILE_INFO':
      return {
        ...state,
        [contentKey]: {
          ...prevContentState,
          ...action.data
        }
      };
    case 'UPDATE_STATUS_MSG':
      return {
        ...state,
        [contentKey]: {
          ...prevContentState,
          statusMsg: action.statusMsg,
          statusColor: action.statusColor
        }
      };
    case 'UPDATE_USER_BIO':
      return {
        ...state,
        [contentKey]: {
          ...prevContentState,
          ...action.bio
        }
      };
    case 'UPDATE_USER_GREETING':
      return {
        ...state,
        [contentKey]: {
          ...prevContentState,
          greeting: action.greeting
        }
      };
    case 'UPLOAD_COMMENT': {
      const subjectState =
        action.data.subjectId &&
        !action.data.commentId &&
        state['subject' + action.data.subjectId]
          ? {
              ['subject' + action.data.subjectId]: {
                ...state['subject' + action.data.subjectId],
                comments: [action.data].concat(
                  state['subject' + action.data.subjectId].comments
                )
              }
            }
          : {};
      return {
        ...state,
        ...subjectState,
        [contentKey]: {
          ...prevContentState,
          comments:
            prevContentState.contentType === 'comment'
              ? (prevContentState.comments || []).concat([action.data])
              : [action.data].concat(prevContentState.comments),
          subjects: prevContentState.subjects?.map((subject) =>
            subject.id === action.data.subjectId
              ? {
                  ...subject,
                  comments: [action.data].concat(subject.comments)
                }
              : subject
          )
        }
      };
    }

    case 'UPLOAD_REPLY': {
      let subjectState = {};
      if (action.data.subjectId && state['subject' + action.data.subjectId]) {
        subjectState = {
          ['subject' + action.data.subjectId]: {
            ...state['subject' + action.data.subjectId],
            comments: state['subject' + action.data.subjectId].comments.map(
              (comment) =>
                comment.id === action.data.commentId ||
                comment.id === action.data.replyId
                  ? {
                      ...comment,
                      replies: (comment.replies || []).concat([action.data])
                    }
                  : comment
            )
          }
        };
      }

      return {
        ...state,
        ...subjectState,
        [contentKey]: {
          ...prevContentState,
          comments: prevContentState.comments.map((comment) => {
            let match = false;
            let commentId = action.data.replyId || action.data.commentId;
            if (comment.id === commentId) {
              match = true;
            } else {
              for (let reply of comment.replies || []) {
                if (reply.id === commentId) {
                  match = true;
                  break;
                }
              }
            }
            return {
              ...comment,
              replies: match
                ? (comment.replies || []).concat([action.data])
                : comment.replies
            };
          }),
          subjects: prevContentState.subjects?.map((subject) => {
            return {
              ...subject,
              comments: subject.comments.map((comment) =>
                comment.id === action.data.commentId ||
                comment.id === action.data.replyId
                  ? {
                      ...comment,
                      replies: (comment.replies || []).concat([action.data])
                    }
                  : comment
              )
            };
          })
        }
      };
    }
    case 'UPLOAD_SUBJECT':
      return {
        ...state,
        [contentKey]: {
          ...prevContentState,
          subjects: [action.subject].concat(prevContentState.subjects)
        }
      };
    case 'UPLOAD_TARGET_COMMENT':
      return {
        ...state,
        [contentKey]: {
          ...prevContentState,
          targetObj: {
            ...prevContentState.targetObj,
            comment: {
              ...prevContentState.targetObj.comment,
              comments: [action.data].concat(
                prevContentState.targetObj?.comment?.comments || []
              )
            }
          }
        }
      };
    default:
      return state;
  }
}
