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
      videos: { continueWatchingVideos, continueWatchingLoaded }
    },
    actions: { onLoadContinueWatching }
  } = useExploreContext();
  useEffect(() => {
    init();

    async function init() {
      if (!continueWatchingLoaded) {
        const videos = await loadContinueWatching();
        onLoadContinueWatching(videos);
        loadedRef.current = true;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [continueWatchingLoaded]);

  return (
    <ErrorBoundary>
      <SectionPanel
        title="Continue Watching"
        isEmpty={false}
        loaded={true}
        onLoadMore={() => console.log('plz load more')}
        loadMoreButtonShown={true}
      >
        {continueWatchingVideos.map((video, index) => (
          <VideoThumb
            to={`videos/${video.id}`}
            key={index}
            video={video}
            user={video.uploader}
          />
        ))}
      </SectionPanel>
    </ErrorBoundary>
  );
}
