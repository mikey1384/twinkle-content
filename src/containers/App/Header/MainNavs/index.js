import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Nav from './Nav';
import Icon from 'components/Icon';
import { matchPath } from 'react-router-dom';
import { mobileMaxWidth } from 'constants/css';
import { css } from '@emotion/css';
import { getSectionFromPathname } from 'helpers';
import { addCommasToNumber, truncateText } from 'helpers/stringHelpers';
import {
  useAppContext,
  useChatContext,
  useHomeContext,
  useViewContext,
  useKeyContext
} from 'contexts';
import { socket } from 'constants/io';
import localize from 'constants/localize';

MainNavs.propTypes = {
  loggedIn: PropTypes.bool,
  numChatUnreads: PropTypes.number,
  numNewNotis: PropTypes.number,
  numNewPosts: PropTypes.number,
  onMobileMenuOpen: PropTypes.func.isRequired,
  pathname: PropTypes.string,
  search: PropTypes.string,
  defaultSearchFilter: PropTypes.string,
  totalRewardAmount: PropTypes.number
};

const homeLabel = localize('home');
const exploreLabel = localize('explore');
const missionsLabel = localize('missions');
const chatLabel = localize('chat');

function MainNavs({
  loggedIn,
  numChatUnreads,
  numNewNotis,
  numNewPosts,
  onMobileMenuOpen,
  pathname,
  search,
  defaultSearchFilter,
  totalRewardAmount
}) {
  const [twinkleCoinsHovered, setTwinkleCoinsHovered] = useState(false);
  const { twinkleCoins, userId, banned, lastChatPath } = useKeyContext(
    (v) => v.myState
  );
  const exploreCategory = useViewContext((v) => v.state.exploreCategory);
  const contentPath = useViewContext((v) => v.state.contentPath);
  const contentNav = useViewContext((v) => v.state.contentNav);
  const profileNav = useViewContext((v) => v.state.profileNav);
  const homeNav = useViewContext((v) => v.state.homeNav);
  const onSetExploreCategory = useViewContext(
    (v) => v.actions.onSetExploreCategory
  );
  const onSetContentPath = useViewContext((v) => v.actions.onSetContentPath);
  const onSetContentNav = useViewContext((v) => v.actions.onSetContentNav);
  const onSetProfileNav = useViewContext((v) => v.actions.onSetProfileNav);
  const onSetHomeNav = useViewContext((v) => v.actions.onSetHomeNav);

  const onSetLastChatPath = useAppContext(
    (v) => v.user.actions.onSetLastChatPath
  );
  const feedsOutdated = useHomeContext((v) => v.state.feedsOutdated);
  const chatType = useChatContext((v) => v.state.chatType);
  const chatLoaded = useChatContext((v) => v.state.loaded);
  const loaded = useRef(false);
  const timerRef = useRef(null);

  const contentLabel = useMemo(() => {
    if (!contentNav) return null;
    return localize(contentNav.substring(0, contentNav.length - 1));
  }, [contentNav]);

  const displayedTwinkleCoins = useMemo(() => {
    if (twinkleCoins > 999) {
      if (twinkleCoinsHovered) {
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
          setTwinkleCoinsHovered(false);
        }, 1500);
        return addCommasToNumber(twinkleCoins);
      }
      return '999+';
    }
    return twinkleCoins;
  }, [twinkleCoins, twinkleCoinsHovered]);

  const chatMatch = useMemo(
    () =>
      matchPath(
        {
          path: '/chat/*'
        },
        pathname
      ),
    [pathname]
  );

  const homeMatch = useMemo(
    () =>
      matchPath(
        {
          path: '/',
          exact: true
        },
        pathname
      ),
    [pathname]
  );

  const usersMatch = useMemo(
    () =>
      matchPath(
        {
          path: '/users',
          exact: true
        },
        pathname
      ),
    [pathname]
  );

  const earnMatch = useMemo(
    () =>
      matchPath(
        {
          path: '/earn',
          exact: true
        },
        pathname
      ),
    [pathname]
  );

  const storeMatch = useMemo(
    () =>
      matchPath(
        {
          path: '/store',
          exact: true
        },
        pathname
      ),
    [pathname]
  );

  const contentPageMatch = useMemo(() => {
    const subjectPageMatch = matchPath(
      {
        path: '/subjects/:id',
        exact: true
      },
      pathname
    );
    const playlistsMatch = matchPath(
      {
        path: '/playlists/:id',
        exact: true
      },
      pathname
    );
    const videoPageMatch = matchPath(
      {
        path: '/videos/:id',
        exact: true
      },
      pathname
    );
    const linkPageMatch = matchPath(
      {
        path: '/links/:id',
        exact: true
      },
      pathname
    );
    const commentPageMatch = matchPath(
      {
        path: '/comments/:id',
        exact: true
      },
      pathname
    );
    const missionPageMatch = matchPath(
      {
        path: '/missions/:missionType/*'
      },
      pathname
    );

    return (
      !!subjectPageMatch ||
      !!playlistsMatch ||
      !!videoPageMatch ||
      !!linkPageMatch ||
      !!commentPageMatch ||
      !!missionPageMatch
    );
  }, [pathname]);

  const profilePageMatch = matchPath(
    {
      path: '/users/:userId/*'
    },
    pathname
  );

  useEffect(() => {
    const { section } = getSectionFromPathname(pathname);
    if (homeMatch) {
      onSetHomeNav('/');
    } else if (usersMatch) {
      onSetHomeNav('/users');
    } else if (earnMatch) {
      onSetHomeNav('/earn');
    } else if (storeMatch) {
      onSetHomeNav('/store');
    }

    if (chatMatch) {
      const lastChatPath = pathname.split('chat')[1]
        ? pathname.split('chat')[1]
        : '';
      onSetLastChatPath(lastChatPath);
    }

    if (contentPageMatch) {
      if (contentNav !== section) {
        onSetContentNav(section);
      }
      onSetContentPath(pathname.substring(1) + search || '');
    }

    if (profilePageMatch) {
      onSetProfileNav(pathname);
    }

    if (['links', 'videos', 'subjects'].includes(section)) {
      onSetExploreCategory(section);
      loaded.current = true;
    } else if (!loaded.current && defaultSearchFilter) {
      onSetExploreCategory(
        ['videos', 'subjects', 'links'].includes(defaultSearchFilter)
          ? defaultSearchFilter
          : 'subjects'
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultSearchFilter, pathname]);

  const contentIconType = useMemo(
    () =>
      contentNav === 'videos' || contentNav === 'playlists'
        ? 'film'
        : contentNav === 'links'
        ? 'book'
        : contentNav === 'subjects'
        ? 'bolt'
        : contentNav === 'missions'
        ? 'clipboard-check'
        : 'comment-alt',
    [contentNav]
  );

  const profileUsername = useMemo(() => {
    let result = '';
    if (profileNav) {
      const splitProfileNav = profileNav.split('/users/')[1].split('/');
      result = splitProfileNav[0];
    }
    return result;
  }, [profileNav]);

  const chatAlertShown = useMemo(
    () => loggedIn && !chatMatch && numChatUnreads > 0,
    [chatMatch, loggedIn, numChatUnreads]
  );

  const chatButtonPath = useMemo(() => {
    return `/chat${
      chatLoaded
        ? chatType === 'vocabulary'
          ? '/vocabulary'
          : lastChatPath
        : ''
    }`;
  }, [chatLoaded, chatType, lastChatPath]);

  useEffect(() => {
    socket.emit('change_busy_status', !chatMatch);
  }, [chatMatch]);

  return (
    <div
      className={css`
        padding: 0;
        display: flex;
        justify-content: center;
        width: auto;
        @media (max-width: ${mobileMaxWidth}) {
          width: 100%;
        }
      `}
    >
      <Nav
        isMobileSideMenu
        className="mobile"
        alert={numNewNotis > 0 || totalRewardAmount > 0}
        imgLabel="bars"
        onClick={onMobileMenuOpen}
      />
      {profileNav && (
        <Nav
          to={profileNav}
          pathname={pathname}
          className="mobile"
          imgLabel="user"
        />
      )}
      <Nav
        to={homeNav}
        isHome
        className="mobile"
        imgLabel="home"
        alert={pathname === '/' && (numNewPosts > 0 || feedsOutdated)}
      />
      <Nav
        to={`/${exploreCategory}`}
        pathname={pathname}
        className="mobile"
        imgLabel="search"
      />
      {contentNav && (
        <Nav
          to={`/${contentPath}`}
          pathname={pathname}
          className="mobile"
          imgLabel={contentIconType}
        />
      )}
      <Nav
        to={`/missions`}
        pathname={pathname}
        className="mobile"
        imgLabel="tasks"
      />
      {!banned?.chat && (
        <Nav
          to={chatButtonPath}
          pathname={pathname}
          className="mobile"
          imgLabel="comments"
          alert={chatAlertShown}
        />
      )}
      {profileNav && (
        <Nav
          to={profileNav}
          profileUsername={profileUsername}
          pathname={pathname}
          className="desktop"
          style={{ marginRight: '2rem' }}
          imgLabel="user"
        >
          {truncateText({ text: profileUsername.toUpperCase(), limit: 7 })}
        </Nav>
      )}
      <Nav
        to={homeNav}
        isHome
        pathname={pathname}
        className="desktop"
        imgLabel="home"
        alert={pathname === '/' && !usersMatch && numNewPosts > 0}
      >
        {homeLabel}
        {pathname === '/' && !usersMatch && numNewPosts > 0
          ? ` (${numNewPosts})`
          : ''}
      </Nav>
      <Nav
        to={`/${exploreCategory}`}
        pathname={pathname}
        className="desktop"
        style={{ marginLeft: '2rem' }}
        imgLabel="search"
      >
        {exploreLabel}
      </Nav>
      {contentNav && (
        <Nav
          to={`/${contentPath}`}
          pathname={pathname}
          className="desktop"
          style={{ marginLeft: '2rem' }}
          imgLabel={contentIconType}
        >
          {contentLabel}
        </Nav>
      )}
      <Nav
        to={`/missions`}
        pathname={pathname}
        className="desktop"
        style={{ marginLeft: '2rem' }}
        imgLabel="tasks"
      >
        {missionsLabel}
      </Nav>
      <div
        className={css`
          margin-left: 2rem;
          @media (max-width: ${mobileMaxWidth}) {
            margin-left: 0;
          }
        `}
      >
        {!banned?.chat && (
          <Nav
            to={chatButtonPath}
            pathname={pathname}
            className="desktop"
            imgLabel="comments"
            alert={chatAlertShown}
          >
            {chatLabel}
          </Nav>
        )}
      </div>
      {userId && typeof twinkleCoins === 'number' && (
        <div
          className={`mobile ${css`
            @media (max-width: ${mobileMaxWidth}) {
              font-size: 1.3rem;
            }
          `}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            paddingRight: '1rem'
          }}
          onClick={() => setTwinkleCoinsHovered(true)}
        >
          <Icon
            style={{ marginRight: '0.5rem' }}
            icon={['far', 'badge-dollar']}
          />
          {displayedTwinkleCoins}
        </div>
      )}
    </div>
  );
}

export default memo(MainNavs);
