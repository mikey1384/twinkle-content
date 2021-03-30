import React, { useEffect, useRef, useState } from 'react';
import { useAppContext, useExploreContext } from 'contexts';
import ErrorBoundary from 'components/ErrorBoundary';
import SectionPanel from 'components/SectionPanel';
import VideoThumb from 'components/VideoThumb';
import Icon from 'components/Icon';

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
    actions: { onLoadContinueWatching, onLoadMoreContinueWatching }
  } = useExploreContext();
  const [loaded, setLoaded] = useState(continueWatchingLoaded);
  useEffect(() => {
    init();

    async function init() {
      if (!continueWatchingLoaded) {
        const { videos, loadMoreButton } = await loadContinueWatching();
        onLoadContinueWatching({ videos, loadMoreButton });
        setLoaded(true);
        loadedRef.current = true;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [continueWatchingLoaded]);

  return (
    <ErrorBoundary>
      <SectionPanel
        loaded={loaded}
        title={
          loaded ? (
            'Continue Watching'
          ) : (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                verticalAlign: 0
              }}
            >
              <span>Loading</span>
              <Icon style={{ marginLeft: '1rem' }} icon="spinner" pulse />
            </div>
          )
        }
        onLoadMore={handleLoadMoreContinueWatching}
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
    </ErrorBoundary>
  );

  async function handleLoadMoreContinueWatching() {
    const { videos, loadMoreButton } = await loadContinueWatching(
      continueWatchingVideos[continueWatchingVideos.length - 1]?.viewTimeStamp
    );
    onLoadMoreContinueWatching({ videos, loadMoreButton });
  }
}
