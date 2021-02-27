import React, { useEffect, useState } from 'react';
import { useContentState } from 'helpers/hooks';
import PropTypes from 'prop-types';
import Comment from './Comment';
import { useAppContext, useContentContext } from 'contexts';

PinnedComment.propTypes = {
  commentId: PropTypes.number.isRequired,
  parent: PropTypes.object,
  rootContent: PropTypes.object,
  subject: PropTypes.object,
  userId: PropTypes.number
};

export default function PinnedComment({
  commentId,
  parent,
  rootContent,
  subject,
  userId
}) {
  const {
    requestHelpers: { loadContent }
  } = useAppContext();
  const {
    actions: { onInitContent }
  } = useContentContext();
  const comment = useContentState({
    contentType: 'comment',
    contentId: commentId
  });
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (!comment.loaded) {
      return init();
    }
    setLoaded(true);

    async function init() {
      const data = await loadContent({
        contentId: commentId,
        contentType: 'comment'
      });
      onInitContent({ contentId: commentId, contentType: 'comment', ...data });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [comment, commentId]);

  return loaded ? (
    <Comment
      parent={parent}
      rootContent={rootContent}
      subject={subject}
      comment={comment}
      userId={userId}
      isPinned
    />
  ) : null;
}
