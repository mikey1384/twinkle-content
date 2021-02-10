import React, { useEffect } from 'react';
import FeaturedSubjects from './FeaturedSubjects';
import RecommendedSubjects from './RecommendedSubjects';
import { useAppContext, useExploreContext } from 'contexts';

export default function Subjects() {
  const {
    requestHelpers: { loadFeaturedSubjects, loadRecommendedUploads }
  } = useAppContext();
  const {
    state: {
      subjects: {
        loaded,
        featureds,
        featuredLoaded,
        featuredLoadedMore,
        recommendeds,
        recommendedLoadMoreButton,
        recommendedLoaded
      }
    },
    actions: {
      onLoadFeaturedSubjects,
      onSetFeaturedSubjectsLoadedMore,
      onLoadRecommendedSubjects,
      onSetSubjectsLoaded
    }
  } = useExploreContext();
  useEffect(() => {
    init();
    async function init() {
      if (!loaded) {
        handleLoadFeaturedSubjects();
        handleLoadRecommendedSubjects();
        onSetSubjectsLoaded(true);
      }
    }

    async function handleLoadFeaturedSubjects() {
      const subjects = await loadFeaturedSubjects();
      onLoadFeaturedSubjects(subjects);
    }

    async function handleLoadRecommendedSubjects() {
      const {
        results,
        loadMoreButton: loadMoreRecommendsButton
      } = await loadRecommendedUploads({
        contentType: 'subject',
        limit: 5
      });
      onLoadRecommendedSubjects({
        subjects: results,
        loadMoreButton: loadMoreRecommendsButton
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded]);

  return (
    <div>
      <FeaturedSubjects
        loaded={featuredLoaded}
        loadedMore={featuredLoadedMore}
        subjects={featureds}
        onSubmit={onLoadFeaturedSubjects}
        onLoadMore={() => onSetFeaturedSubjectsLoadedMore(true)}
      />
      <RecommendedSubjects
        subjects={recommendeds}
        loadMorebutton={recommendedLoadMoreButton}
        loaded={recommendedLoaded}
        onLoadMore={() => console.log('loading more')}
      />
    </div>
  );
}
