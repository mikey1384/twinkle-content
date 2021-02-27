import React, { useEffect, useState } from 'react';
import { useContentState } from 'helpers/hooks';
import PropTypes from 'prop-types';
import Comment from './Comment';

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
  const comment = useContentState({
    contentType: 'comment',
    contentId: commentId
  });
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (!comment.loaded) {
      return console.log('gotta load');
    }
    setLoaded(true);
  }, [comment]);

  return (
    <div>
      {loaded && (
        <Comment
          parent={parent}
          rootContent={rootContent}
          subject={subject}
          comment={comment}
          userId={userId}
          isPinned
        />
      )}
    </div>
  );
}
