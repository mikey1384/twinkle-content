import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import SectionPanel from 'components/SectionPanel';
import ContentListItem from 'components/ContentListItem';
import { useAppContext, useExploreContext } from 'contexts';

Recommended.propTypes = {
  expanded: PropTypes.bool,
  loaded: PropTypes.bool,
  loadMoreButton: PropTypes.bool,
  onExpand: PropTypes.func.isRequired,
  subjects: PropTypes.array.isRequired,
  style: PropTypes.object
};

export default function Recommended({
  expanded,
  subjects,
  loaded,
  loadMoreButton,
  onExpand,
  style
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
        style={style}
        title="Recommended"
        loadMoreButtonShown={
          (!expanded && subjects.length > 1) || loadMoreButton
        }
        onLoadMore={handleLoadMore}
        isEmpty={subjects.length === 0}
        emptyMessage="No Recommended Subjects"
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
