import React, { useEffect } from 'react';
import FeaturedSubjects from './FeaturedSubjects';
import RecommendedSubjects from './RecommendedSubjects';
import ErrorBoundary from 'components/ErrorBoundary';
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
        featuredExpanded,
        recommendeds,
        recommendedExpanded,
        recommendedLoadMoreButton,
        recommendedLoaded
      }
    },
    actions: {
      onLoadFeaturedSubjects,
      onSetFeaturedSubjectsExpanded,
      onSetRecommendedSubjectsExpanded,
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
      <ErrorBoundary>
        <FeaturedSubjects
          loaded={featuredLoaded}
          expanded={featuredExpanded}
          subjects={featureds}
          onSubmit={onLoadFeaturedSubjects}
          onExpand={() => onSetFeaturedSubjectsExpanded(true)}
        />
        <RecommendedSubjects
          style={{ marginTop: '2.5rem' }}
          expanded={recommendedExpanded}
          subjects={recommendeds}
          loadMorebutton={recommendedLoadMoreButton}
          loaded={recommendedLoaded}
          onExpand={() => onSetRecommendedSubjectsExpanded(true)}
        />
      </ErrorBoundary>
    </div>
  );
}
