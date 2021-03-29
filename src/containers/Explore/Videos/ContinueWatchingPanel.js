import React, { useEffect } from 'react';
import { useAppContext } from 'contexts';
import ErrorBoundary from 'components/ErrorBoundary';
import SectionPanel from 'components/SectionPanel';

export default function ContinueWatchingPanel() {
  const {
    requestHelpers: { loadContinueWatching }
  } = useAppContext();
  useEffect(() => {
    init();

    async function init() {
      const videos = await loadContinueWatching();
      console.log(videos);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ErrorBoundary>
      <SectionPanel
        title="Continue Watching"
        isEmpty={false}
        loaded={true}
        onLoadMore={() => console.log('plz load more')}
        loadMoreButtonShown={true}
      ></SectionPanel>
    </ErrorBoundary>
  );
}
