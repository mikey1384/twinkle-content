import React from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import SectionPanel from 'components/SectionPanel';
import ContentListItem from 'components/ContentListItem';

RecommendedSubjects.propTypes = {
  loaded: PropTypes.bool,
  loadMorebutton: PropTypes.bool,
  subjects: PropTypes.array.isRequired,
  onLoadMore: PropTypes.func.isRequired
};

export default function RecommendedSubjects({
  subjects,
  loaded,
  loadMorebutton,
  onLoadMore
}) {
  return (
    <ErrorBoundary>
      <SectionPanel
        title="Recommended"
        loadMoreButtonShown={loadMorebutton}
        onLoadMore={onLoadMore}
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
}
