import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import AddLinkModal from './AddLinkModal';
import Button from 'components/Button';
import SectionPanel from 'components/SectionPanel';
import LinkGroup from './LinkGroup';
import { isMobile } from 'helpers';
import { useScrollPosition } from 'helpers/hooks';
import { useAppContext, useViewContext, useExploreContext } from 'contexts';

Links.propTypes = {
  location: PropTypes.object
};

export default function Links({ location }) {
  const {
    requestHelpers: { loadRecommendedUploads, loadUploads }
  } = useAppContext();
  const {
    state: {
      links: {
        loaded,
        recommendedsLoaded,
        recommendeds,
        loadMoreRecommendedsButtonShown,
        links,
        loadMoreLinksButtonShown
      }
    },
    actions: {
      onLoadLinks,
      onLoadMoreLinks,
      onLoadRecommendedLinks,
      onLoadMoreRecommendedLinks
    }
  } = useExploreContext();
  const {
    actions: { onRecordScrollPosition },
    state: { scrollPositions }
  } = useViewContext();
  useScrollPosition({
    onRecordScrollPosition,
    pathname: location.pathname,
    scrollPositions,
    isMobile: isMobile(navigator)
  });
  const [addLinkModalShown, setAddLinkModalShown] = useState(false);
  const mounted = useRef(true);
  const lastId = useRef(null);
  const lastRecommendedId = useRef(null);
  const lastRecommendedTime = useRef(null);
  const prevLoaded = useRef(false);

  useEffect(() => {
    if (recommendeds.length > 0) {
      lastRecommendedId.current = recommendeds[recommendeds.length - 1].feedId;
      lastRecommendedTime.current =
        recommendeds[recommendeds.length - 1].lastInteraction;
    }
  }, [recommendeds]);

  useEffect(() => {
    if (links.length > 0) {
      lastId.current = links[links.length - 1].id;
    }
  }, [links]);

  useEffect(() => {
    mounted.current = true;
    init();
    async function init() {
      if (!loaded) {
        const {
          results: recommendedLinks,
          loadMoreButton: loadMoreRecommendsButton
        } = await loadRecommendedUploads({
          contentType: 'url',
          numberToLoad: 10
        });
        const { results: links, loadMoreButton } = await loadUploads({
          contentType: 'url',
          numberToLoad: 10
        });
        onLoadRecommendedLinks({
          links: recommendedLinks,
          loadMoreButton: loadMoreRecommendsButton
        });
        onLoadLinks({ links, loadMoreButton });
        prevLoaded.current = true;
      }
    }

    return function cleanUp() {
      mounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded]);

  return (
    <div>
      <SectionPanel
        title="Recommended"
        emptyMessage="No Recommended Links"
        isEmpty={recommendeds.length === 0}
        loaded={recommendedsLoaded}
        loadMore={handleLoadMoreRecommendeds}
        loadMoreButtonShown={loadMoreRecommendedsButtonShown}
      >
        <LinkGroup links={recommendeds} />
      </SectionPanel>
      <SectionPanel
        title="All Links"
        button={
          <Button
            skeuomorphic
            color="darkerGray"
            onClick={() => setAddLinkModalShown(true)}
          >
            + Add Link
          </Button>
        }
        emptyMessage="No Uploaded Links"
        isEmpty={links.length === 0}
        loaded={loaded || prevLoaded.current}
        loadMore={handleLoadMoreLinks}
        loadMoreButtonShown={loadMoreLinksButtonShown}
      >
        <LinkGroup links={links} />
      </SectionPanel>
      {addLinkModalShown && (
        <AddLinkModal onHide={() => setAddLinkModalShown(false)} />
      )}
    </div>
  );

  async function handleLoadMoreRecommendeds() {
    const { results, loadMoreButton } = await loadRecommendedUploads({
      contentType: 'url',
      numberToLoad: 20,
      lastRecommendationId: lastRecommendedId.current,
      lastInteraction: lastRecommendedTime.current
    });
    return onLoadMoreRecommendedLinks({ links: results, loadMoreButton });
  }

  async function handleLoadMoreLinks() {
    const { results: links, loadMoreButton } = await loadUploads({
      contentType: 'url',
      numberToLoad: 20,
      contentId: lastId.current
    });
    return onLoadMoreLinks({ links, loadMoreButton });
  }
}
