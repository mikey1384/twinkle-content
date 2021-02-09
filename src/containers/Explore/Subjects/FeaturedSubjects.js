import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import ContentListItem from 'components/ContentListItem';
import SectionPanel from 'components/SectionPanel';
import SelectFeaturedSubjects from '../Modals/SelectFeaturedSubjects';
import ReorderFeaturedSubjects from '../Modals/ReorderFeaturedSubjects';
import Button from 'components/Button';
import { useMyState } from 'helpers/hooks';

FeaturedSubjects.propTypes = {
  loaded: PropTypes.bool,
  loadedMore: PropTypes.bool,
  subjects: PropTypes.array,
  onLoadMore: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};
export default function FeaturedSubjects({
  loaded,
  loadedMore,
  subjects,
  onLoadMore,
  onSubmit
}) {
  const { userId, canPinPlaylists } = useMyState();
  const [reorderModalShown, setReorderModalShown] = useState(false);
  const [selectModalShown, setSelectModalShown] = useState(false);
  const shownSubjects = useMemo(() => {
    if (loadedMore) {
      return subjects;
    }
    return subjects[0] ? [subjects[0]] : [];
  }, [subjects, loadedMore]);

  return (
    <ErrorBoundary>
      <SectionPanel
        title="Featured"
        loadMoreButtonShown={!loadedMore}
        onLoadMore={onLoadMore}
        button={
          userId && canPinPlaylists ? (
            <div style={{ display: 'flex' }}>
              <Button
                skeuomorphic
                color="darkerGray"
                style={{ marginLeft: 'auto' }}
                onClick={() => setSelectModalShown(true)}
              >
                Select
              </Button>
              <Button
                skeuomorphic
                color="darkerGray"
                style={{ marginLeft: '1rem' }}
                onClick={() => setReorderModalShown(true)}
              >
                Reorder
              </Button>
            </div>
          ) : null
        }
        isEmpty={subjects.length === 0}
        emptyMessage="No featured subjects for now..."
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
      {selectModalShown && (
        <SelectFeaturedSubjects
          subjects={subjects}
          onHide={() => setSelectModalShown(false)}
          onSubmit={(selectedSubjects) => {
            onSubmit(selectedSubjects);
            setSelectModalShown(false);
          }}
        />
      )}
      {reorderModalShown && (
        <ReorderFeaturedSubjects
          subjectIds={subjects.map((subject) => subject.id)}
          onHide={() => setReorderModalShown(false)}
        />
      )}
    </ErrorBoundary>
  );
}
