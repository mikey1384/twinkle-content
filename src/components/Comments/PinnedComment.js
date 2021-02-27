import React, { useEffect, useState } from 'react';
import { useContentState } from 'helpers/hooks';
import PropTypes from 'prop-types';

PinnedComment.propTypes = {
  commentId: PropTypes.number.isRequired
};

export default function PinnedComment({ commentId }) {
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
        <div>this is where the pinned comment is gonna go {commentId}</div>
      )}
    </div>
  );
}
