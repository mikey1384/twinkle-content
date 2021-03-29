import React from 'react';
import ErrorBoundary from 'components/ErrorBoundary';
import SectionPanel from 'components/SectionPanel';

export default function ContinueWatchingPanel() {
  return (
    <ErrorBoundary>
      <SectionPanel
        title="Continue Watching"
        isEmpty={false}
        loaded={true}
        onLoadMore={() => console.log('plz load more')}
        loadMoreButtonShown={true}
      ></SectionPanel>
    </ErrorBoundary>
  );
}
