import React, { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/Icon';
import { useLocation, useNavigate } from 'react-router-dom';
import { Color, desktopMinWidth, mobileMaxWidth } from 'constants/css';
import { css } from '@emotion/css';
import {
  useAppContext,
  useContentContext,
  useExploreContext,
  useProfileContext
} from 'contexts';

const BodyRef = document.scrollingElement || document.documentElement;

Nav.propTypes = {
  isMobileSideMenu: PropTypes.bool,
  active: PropTypes.bool,
  alert: PropTypes.bool,
  alertColor: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
  imgLabel: PropTypes.string,
  isHome: PropTypes.bool,
  to: PropTypes.string,
  style: PropTypes.object
};

function Nav({
  active,
  alert,
  alertColor,
  className,
  children,
  imgLabel,
  isHome,
  isMobileSideMenu,
  to,
  style
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const onResetProfile = useProfileContext((v) => v.actions.onResetProfile);
  const profileState = useProfileContext((v) => v.state) || {};
  const onReloadContent = useContentContext((v) => v.actions.onReloadContent);
  const onClearLinksLoaded = useExploreContext(
    (v) => v.actions.onClearLinksLoaded
  );
  const onClearVideosLoaded = useExploreContext(
    (v) => v.actions.onClearVideosLoaded
  );
  const onSetSubjectsLoaded = useExploreContext(
    (v) => v.actions.onSetSubjectsLoaded
  );
  const highlightColor = useMemo(
    () => (alert ? alertColor : Color.darkGray()),
    [alert, alertColor]
  );
  const onSetProfilesLoaded = useAppContext(
    (v) => v.user.actions.onSetProfilesLoaded
  );

  return (
    <div
      onClick={() => {
        if (!isMobileSideMenu) {
          if (location.pathname) {
            handleMatch(location.pathname);
          }
        } else {
          handleNavClick();
        }
      }}
      className={`${className} ${css`
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        .chat {
          color: ${Color.lightGray()};
        }
        nav {
          text-decoration: none;
          font-weight: bold;
          color: ${Color.lightGray()};
          align-items: center;
          line-height: 1;
        }
        > nav.active {
          color: ${highlightColor}!important;
          > svg {
            color: ${highlightColor}!important;
          }
        }
        @media (min-width: ${desktopMinWidth}) {
          &:hover {
            > nav {
              > svg {
                color: ${highlightColor};
              }
              color: ${highlightColor};
            }
          }
        }
        @media (max-width: ${mobileMaxWidth}) {
          width: 100%;
          justify-content: center;
          font-size: 3rem;
          nav {
            .nav-label {
              display: none;
            }
          }
          > nav.active {
            > svg {
              color: ${highlightColor};
            }
          }
        }
      `}`}
      style={style}
    >
      {!isMobileSideMenu ? (
        <nav
          className={location.pathname ? 'active ' : ''}
          style={{
            display: 'flex',
            alignItems: 'center',
            ...(alert ? { color: alertColor || Color.gold() } : {})
          }}
          onClick={handleNavClick}
        >
          <Icon icon={isHome ? 'home' : imgLabel} />
          <span className="nav-label" style={{ marginLeft: '0.7rem' }}>
            {children}
          </span>
        </nav>
      ) : (
        <nav
          className={active ? 'active ' : ''}
          style={{
            display: 'flex',
            cursor: 'pointer',
            justifyContent: 'center'
          }}
        >
          <Icon
            style={{
              ...(alert ? { color: alertColor || Color.gold() } : {})
            }}
            icon={imgLabel}
          />
          <span
            className="nav-label"
            style={{
              marginLeft: '0.7rem',
              ...(alert ? { color: alertColor || Color.gold() } : {})
            }}
          >
            {children}
          </span>
        </nav>
      )}
    </div>
  );

  function handleNavClick() {
    navigate(to);
  }

  function handleMatch(pathname) {
    if (pathname === '/') {
      document.getElementById('App').scrollTop = 0;
      BodyRef.scrollTop = 0;
    }
    if (pathname.includes('/users/')) {
      const username = pathname.split('/users/')[1].split('/')[0];
      const { profileId } = profileState[username] || {};
      onReloadContent({
        contentId: profileId,
        contentType: 'user'
      });
      onResetProfile(username);
    }
    if (pathname === '/users') {
      onSetProfilesLoaded(false);
    }
    if (
      ['/featured', '/videos', '/links', '/subjects', '/comments'].includes(
        pathname
      )
    ) {
      onClearLinksLoaded();
      onSetSubjectsLoaded(false);
      onClearVideosLoaded();
    }
    document.getElementById('App').scrollTop = 0;
    BodyRef.scrollTop = 0;
  }
}

export default memo(Nav);
