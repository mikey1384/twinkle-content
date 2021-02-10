import React, { createContext, useReducer } from 'react';
import PropTypes from 'prop-types';
import ExploreActions from './actions';
import ExploreReducer from './reducer';

export const ExploreContext = createContext();
export const initialExploreState = {
  links: {
    byUserLoaded: false,
    byUserLinks: [],
    loadMoreByUserLinksButtonShown: false,
    loaded: false,
    links: [],
    loadMoreLinksButtonShown: false,
    recommendedsLoaded: false,
    recommendeds: [],
    loadMoreRecommendedsButtonShown: false
  },
  subjects: {
    featureds: [],
    featuredExpanded: false,
    recommendeds: [],
    recommendedLoadMoreButton: false,
    loaded: false
  },
  search: {
    results: [],
    loadMoreButton: false,
    searchText: ''
  },
  videos: {
    addPlaylistModalShown: false,
    allPlaylists: [],
    allPlaylistsLoaded: false,
    allVideoThumbs: [],
    featuredPlaylists: [],
    featuredPlaylistsLoaded: false,
    searchedPlaylists: [],
    loadMorePlaylistsButton: false,
    selectFeaturedPlaylistsModalShown: false,
    loadMoreFeaturedPlaylistsButton: false,
    loadMoreSearchedPlaylistsButton: false,
    playlistsToPin: [],
    reorderFeaturedPlaylistsShown: false,
    clickSafe: true
  }
};

ExploreContextProvider.propTypes = {
  children: PropTypes.node
};
export function ExploreContextProvider({ children }) {
  const [exploreState, exploreDispatch] = useReducer(
    ExploreReducer,
    initialExploreState
  );
  return (
    <ExploreContext.Provider
      value={{
        state: exploreState,
        actions: ExploreActions(exploreDispatch)
      }}
    >
      {children}
    </ExploreContext.Provider>
  );
}
