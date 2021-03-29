import React, { useEffect, useRef } from 'react';
import { useAppContext, useExploreContext } from 'contexts';
import ErrorBoundary from 'components/ErrorBoundary';
import SectionPanel from 'components/SectionPanel';
import VideoThumb from 'components/VideoThumb';

export default function ContinueWatchingPanel() {
  const loadedRef = useRef(false);
  const {
    requestHelpers: { loadContinueWatching }
  } = useAppContext();
  const {
    state: {
      videos: {
        continueWatchingVideos,
        continueWatchingLoaded,
        loadMoreContinueWatchingButton
      }
    },
    actions: { onLoadContinueWatching }
  } = useExploreContext();
  useEffect(() => {
    init();

    async function init() {
      if (!continueWatchingLoaded) {
        const { videos, loadMoreButton } = await loadContinueWatching();
        onLoadContinueWatching({ videos, loadMoreButton });
        loadedRef.current = true;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [continueWatchingLoaded]);

  return (
    <ErrorBoundary>
      {continueWatchingVideos.length > 0 ? (
        <SectionPanel
          loaded
          title="Continue Watching"
          onLoadMore={() => console.log('plz load more')}
          loadMoreButtonShown={loadMoreContinueWatchingButton}
        >
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'flex-start',
              width: '100%',
              marginBottom: '1rem'
            }}
          >
            {continueWatchingVideos.map((video, index) => (
              <VideoThumb
                to={`videos/${video.id}`}
                style={{
                  width: `CALC(25% - 0.75rem)`,
                  marginLeft: index % 4 > 0 ? '1rem' : 0,
                  marginTop: index > 3 ? '1.5rem' : 0
                }}
                key={index}
                video={video}
                user={video.uploader}
              />
            ))}
          </div>
        </SectionPanel>
      ) : null}
    </ErrorBoundary>
  );
}
