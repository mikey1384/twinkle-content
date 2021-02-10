import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import SectionPanel from 'components/SectionPanel';
import ContentListItem from 'components/ContentListItem';
import { useAppContext, useExploreContext } from 'contexts';

RecommendedSubjects.propTypes = {
  expanded: PropTypes.bool,
  loaded: PropTypes.bool,
  loadMorebutton: PropTypes.bool,
  onExpand: PropTypes.func.isRequired,
  subjects: PropTypes.array.isRequired
};

export default function RecommendedSubjects({
  expanded,
  subjects,
  loaded,
  loadMorebutton,
  onExpand
}) {
  const {
    requestHelpers: { loadRecommendedUploads }
  } = useAppContext();
  const {
    actions: { onLoadMoreRecommendedSubjects }
  } = useExploreContext();
  const shownSubjects = useMemo(() => {
    if (expanded) {
      return subjects;
    }
    return subjects[0] ? [subjects[0]] : [];
  }, [subjects, expanded]);

  return (
    <ErrorBoundary>
      <SectionPanel
        title="Recommended"
        loadMoreButtonShown={!expanded || loadMorebutton}
        onLoadMore={handleLoadMore}
        isEmpty={subjects.length === 0}
        emptyMessage="No recommended subjects for now..."
        loaded={loaded}
      >
        {shownSubjects.map((subject) => (
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
    if (!expanded) {
      return onExpand();
    }
    const { results, loadMoreButton } = await loadRecommendedUploads({
      contentType: 'subject',
      limit: 10,
      lastRecommendationId: subjects[subjects.length - 1].id,
      lastInteraction: subjects[subjects.length - 1].lastInteraction
    });
    onLoadMoreRecommendedSubjects({ subjects: results, loadMoreButton });
  }
}
