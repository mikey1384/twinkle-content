import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import SectionPanel from 'components/SectionPanel';
import ContentListItem from 'components/ContentListItem';

MadeByUsers.propTypes = {
  expanded: PropTypes.bool,
  loaded: PropTypes.bool,
  loadMoreButton: PropTypes.bool,
  subjects: PropTypes.array,
  style: PropTypes.object
};

export default function MadeByUsers({
  expanded,
  loaded,
  loadMoreButton,
  subjects,
  style
}) {
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
        loadMoreButtonShown={!expanded || loadMoreButton}
        onLoadMore={handleLoadMore}
        isEmpty={subjects.length === 0}
        emptyMessage="No User Made Content"
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

  function handleLoadMore() {
    console.log('loading more');
  }
}
