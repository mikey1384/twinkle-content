import React, { useEffect, useRef } from 'react';
import FeaturedSubjects from './FeaturedSubjects';
import RecommendedSubjects from './RecommendedSubjects';
import { useAppContext, useExploreContext } from 'contexts';

export default function Subjects() {
  const loadedRef = useRef(false);
  const {
    requestHelpers: { loadFeaturedSubjects }
  } = useAppContext();
  const {
    state: {
      subjects: { loaded, featured, featuredLoadedMore }
    },
    actions: { onLoadFeaturedSubjects, onSetFeaturedSubjectsLoadedMore }
  } = useExploreContext();
  useEffect(() => {
    init();
    async function init() {
      if (!loaded) {
        handleLoadFeaturedSubjects();
      }
    }

    async function handleLoadFeaturedSubjects() {
      const subjects = await loadFeaturedSubjects();
      onLoadFeaturedSubjects(subjects);
      loadedRef.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded]);

  return (
    <div>
      <FeaturedSubjects
        loaded={loaded || loadedRef.current}
        loadedMore={featuredLoadedMore}
        subjects={featured}
        onSubmit={onLoadFeaturedSubjects}
        onLoadMore={() => onSetFeaturedSubjectsLoadedMore(true)}
      />
      <RecommendedSubjects />
    </div>
  );
}
