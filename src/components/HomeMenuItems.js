import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Link, Route } from 'react-router-dom';
import Icon from 'components/Icon';
import ErrorBoundary from 'components/ErrorBoundary';
import { Color, mobileMaxWidth } from 'constants/css';
import { isMobile } from 'helpers';
import { useMyState } from 'helpers/hooks';
import { useAppContext } from 'contexts';
import { css } from '@emotion/css';

HomeMenuItems.propTypes = {
  history: PropTypes.object,
  style: PropTypes.object
};

export default function HomeMenuItems({ history, style = {} }) {
  const {
    user: {
      actions: { onSetProfilesLoaded }
    }
  } = useAppContext();
  const { managementLevel } = useMyState();
  const year = useMemo(() => {
    const dt = new Date();
    return dt.getFullYear();
  }, []);

  return (
    <ErrorBoundary>
      <div
        className={`unselectable ${css`
          background: #fff;
          display: flex;
          font-size: 1.7rem;
          font-family: sans-serif, Arial, Helvetica;
          flex-direction: column;
          > nav {
            padding: 1.5rem;
            cursor: pointer;
            display: flex;
            align-items: center;
            color: ${Color.gray()};
            justify-content: center;
            > a {
              margin-left: -2rem;
              text-align: center;
              width: 100%;
              display: flex;
              align-items: center;
              justify-content: center;
              color: ${Color.darkGray()};
              text-decoration: none;
            }
            .homemenu__label {
              margin-left: 2rem;
            }
          }
          > nav:hover {
            color: ${Color.black()};
            font-weight: bold;
            a {
              color: ${Color.black()};
            }
          }
          > nav.active {
            font-weight: bold;
            color: ${Color.black()};
            a {
              color: ${Color.black()};
            }
          }
          @media (max-width: ${mobileMaxWidth}) {
            font-size: 3rem;
            padding: 1rem 0;
            background: #fff;
            border-top: 1px solid ${Color.borderGray()};
            border-bottom: 1px solid ${Color.borderGray()};
            > nav {
              a {
                justify-content: center;
                padding: 0;
              }
              .homemenu__label {
                margin-left: 10%;
              }
            }
          }
        `}`}
        style={style}
      >
        <Route
          path="/"
          exact
          children={({ match }) => (
            <nav
              className={match ? 'active' : ''}
              onClick={() => history.push('/')}
            >
              <a href="/" onClick={(e) => e.preventDefault()}>
                <div
                  style={{
                    width: '3rem',
                    display: 'flex',
                    justifyContent: 'center'
                  }}
                >
                  <Icon icon="book" size="1x" />
                </div>
                <span className="homemenu__label">Stories</span>
              </a>
            </nav>
          )}
        />
        <Route
          exact
          path="/users"
          children={({ match }) => (
            <nav
              className={match ? 'active' : ''}
              onClick={handleOnPeopleClick}
            >
              <a href="/users" onClick={(e) => e.preventDefault()}>
                <div
                  style={{
                    width: '3rem',
                    display: 'flex',
                    justifyContent: 'center'
                  }}
                >
                  <Icon icon="users" size="1x" />
                </div>
                <span className="homemenu__label">People</span>
              </a>
            </nav>
          )}
        />
        <Route
          exact
          path="/earn"
          children={({ match }) => (
            <nav
              className={match ? 'active' : ''}
              onClick={handleOnPeopleClick}
            >
              <a href="/earn" onClick={(e) => e.preventDefault()}>
                <div
                  style={{
                    width: '3rem',
                    display: 'flex',
                    justifyContent: 'center'
                  }}
                >
                  <Icon icon="bolt" size="1x" />
                </div>
                <span className="homemenu__label">Earn XP</span>
              </a>
            </nav>
          )}
        />
        <Route
          exact
          path="/store"
          children={({ match }) => (
            <nav
              className={match ? 'active' : ''}
              onClick={() => history.push('/store')}
            >
              <a href="/store" onClick={(e) => e.preventDefault()}>
                <div
                  style={{
                    width: '3rem',
                    display: 'flex',
                    justifyContent: 'center'
                  }}
                >
                  <Icon icon="shopping-bag" size="1x" />
                </div>
                <span className="homemenu__label">Store</span>
              </a>
            </nav>
          )}
        />
        {managementLevel > 0 && isMobile(navigator) && (
          <Route
            exact
            path="/management"
            children={({ match }) => (
              <nav
                className={match ? 'active' : ''}
                onClick={() => history.push('/management')}
              >
                <a href="/management" onClick={(e) => e.preventDefault()}>
                  <div
                    style={{
                      width: '3rem',
                      display: 'flex',
                      justifyContent: 'center'
                    }}
                  >
                    <Icon icon="sliders-h" size="1x" />
                  </div>
                  <span className="homemenu__label">Manage</span>
                </a>
              </nav>
            )}
          />
        )}
        <div
          style={{
            fontSize: '1rem',
            display: 'flex',
            justifyContent: 'center',
            marginTop: '1.5rem',
            color: Color.gray()
          }}
        >
          <div>
            © {year} Twinkle Network ·{' '}
            <Link to="/privacy" style={{ color: Color.gray() }}>
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );

  function handleOnPeopleClick() {
    if (isMobile(navigator)) {
      onSetProfilesLoaded(false);
    }
    history.push('/users');
  }
}
