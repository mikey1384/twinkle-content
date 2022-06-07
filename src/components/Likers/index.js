import React from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import InnerContent from './InnerContent';

Likers.propTypes = {
  className: PropTypes.string,
  defaultText: PropTypes.string,
  likes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      username: PropTypes.string.isRequired
    })
  ).isRequired,
  onLinkClick: PropTypes.func.isRequired,
  style: PropTypes.object,
  target: PropTypes.string,
  wordBreakEnabled: PropTypes.bool,
  userId: PropTypes.number
};

export default function Likers({
  likes,
  target,
  userId,
  onLinkClick,
  style = {},
  className,
  defaultText,
  wordBreakEnabled
}) {
  return (
    <ErrorBoundary componentPath="Likers/index">
      <div style={style} className={className}>
        <InnerContent
          defaultText={defaultText}
          likes={likes}
          onLinkClick={onLinkClick}
          target={target}
          userId={userId}
          wordBreakEnabled={wordBreakEnabled}
        />
      </div>
    </ErrorBoundary>
  );
}
