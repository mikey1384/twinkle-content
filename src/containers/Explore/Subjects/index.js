import React, { useEffect, useRef, useState } from 'react';
import ErrorBoundary from 'components/ErrorBoundary';
import ContentListItem from 'components/ContentListItem';
import SectionPanel from 'components/SectionPanel';
import SelectFeaturedSubjects from './Modals/SelectFeaturedSubjects';
import ReorderFeaturedSubjects from './Modals/ReorderFeaturedSubjects';
import Button from 'components/Button';
import { useMyState } from 'helpers/hooks';
import { useAppContext, useExploreContext } from 'contexts';

export default function Subjects() {
  const {
    requestHelpers: { loadFeaturedSubjects }
  } = useAppContext();
  const { userId, canPinPlaylists } = useMyState();
  const {
    state: {
      subjects: { loaded, featured }
    },
    actions: { onLoadFeaturedSubjects }
  } = useExploreContext();
  const [reorderModalShown, setReorderModalShown] = useState(false);
  const [selectModalShown, setSelectModalShown] = useState(false);
  const prevLoaded = useRef(false);
  useEffect(() => {
    init();
    async function init() {
      if (!loaded) {
        const subjects = await loadFeaturedSubjects();
        onLoadFeaturedSubjects(subjects);
        prevLoaded.current = true;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded]);

  return (
    <div>
      <ErrorBoundary>
        <SectionPanel
          title="Featured Subjects"
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
          isEmpty={featured.length === 0}
          emptyMessage="No featured subjects for now..."
          loaded={loaded || prevLoaded.current}
        >
          {featured.map((subject) => (
            <ContentListItem
              key={subject.id}
              style={{ marginBottom: '1rem' }}
              contentObj={subject}
            />
          ))}
        </SectionPanel>
        {selectModalShown && (
          <SelectFeaturedSubjects
            subjects={featured}
            onHide={() => setSelectModalShown(false)}
            onSubmit={(selectedSubjects) => {
              onLoadFeaturedSubjects(selectedSubjects);
              setSelectModalShown(false);
            }}
          />
        )}
        {reorderModalShown && (
          <ReorderFeaturedSubjects
            subjectIds={featured.map((subject) => subject.id)}
            onHide={() => setReorderModalShown(false)}
          />
        )}
      </ErrorBoundary>
    </div>
  );
}
