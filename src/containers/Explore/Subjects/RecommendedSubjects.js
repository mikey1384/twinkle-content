import React from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import SectionPanel from 'components/SectionPanel';
import ContentListItem from 'components/ContentListItem';
import { useAppContext, useExploreContext } from 'contexts';

RecommendedSubjects.propTypes = {
  loaded: PropTypes.bool,
  loadMorebutton: PropTypes.bool,
  subjects: PropTypes.array.isRequired
};

export default function RecommendedSubjects({
  subjects,
  loaded,
  loadMorebutton
}) {
  const {
    requestHelpers: { loadRecommendedUploads }
  } = useAppContext();
  const {
    actions: { onLoadMoreRecommendedSubjects }
  } = useExploreContext();

  return (
    <ErrorBoundary>
      <SectionPanel
        title="Recommended"
        loadMoreButtonShown={loadMorebutton}
        onLoadMore={handleLoadMore}
        isEmpty={subjects.length === 0}
        emptyMessage="No recommended subjects for now..."
        loaded={loaded}
      >
        {subjects.map((subject) => (
          <ContentListItem
            key={subject.id}
            style={{ marginBottom: '1rem' }}
            contentObj={subject}
          />
        ))}
      </SectionPanel>
    </ErrorBoundary>
  );

  async function handleLoadMore() {
    const { results, loadMoreButton } = await loadRecommendedUploads({
      contentType: 'subject',
      limit: 10,
      lastRecommendationId: subjects[subjects.length - 1].id,
      lastInteraction: subjects[subjects.length - 1].lastInteraction
    });
    onLoadMoreRecommendedSubjects({ subjects: results, loadMoreButton });
  }
}
