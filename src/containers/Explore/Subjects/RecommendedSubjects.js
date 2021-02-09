import React from 'react';
import ErrorBoundary from 'components/ErrorBoundary';
import SectionPanel from 'components/SectionPanel';

export default function RecommendedSubjects() {
  return (
    <ErrorBoundary>
      <SectionPanel
        title="Recommended"
        loadMoreButtonShown={false}
        onLoadMore={() => console.log('loading more')}
        isEmpty={true}
        emptyMessage="No recommended subjects for now..."
        loaded={true}
      ></SectionPanel>
    </ErrorBoundary>
  );
}
