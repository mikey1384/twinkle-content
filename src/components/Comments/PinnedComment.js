import React from 'react';
import PropTypes from 'prop-types';

PinnedComment.propTypes = {
  commentId: PropTypes.number.isRequired
};

export default function PinnedComment({ commentId }) {
  return (
    <div>
      <div>this is where the pinned comment is gonna go {commentId}</div>
    </div>
  );
}
