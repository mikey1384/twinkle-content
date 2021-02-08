import React, { useState } from 'react';
import ErrorBoundary from 'components/ErrorBoundary';
import SectionPanel from 'components/SectionPanel';

export default function RecommendedSubjects() {
  const [loadMoreButtonShown, setLoadMoreButtonShown] = useState(false);
  return (
    <ErrorBoundary>
      <SectionPanel
        title="Featured Subjects"
        loadMoreButtonShown={loadMoreButtonShown}
        onLoadMore={() => setLoadMoreButtonShown(false)}
        isEmpty={true}
        emptyMessage="No recommended subjects for now..."
        loaded={true}
      ></SectionPanel>
    </ErrorBoundary>
  );
}
