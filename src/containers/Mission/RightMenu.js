import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/Icon';
import { css } from '@emotion/css';
import { Color } from 'constants/css';
import { useLocation, useHistory } from 'react-router-dom';

RightMenu.propTypes = {
  className: PropTypes.string,
  missionType: PropTypes.string,
  style: PropTypes.object
};

export default function RightMenu({ className, missionType, style }) {
  const history = useHistory();
  const location = useLocation();
  return (
    <div
      className={className}
      style={{
        display: 'flex',
        position: 'relative',
        flexDirection: 'column',
        ...style
      }}
    >
      <div
        className={css`
          position: -webkit-sticky;
          > nav {
            padding: 1rem;
            font-size: 2rem;
            font-weight: bold;
            color: ${Color.gray()};
            &:hover {
              color: ${Color.black()};
            }
            &.active {
              color: ${Color.black()};
            }
          }
        `}
        style={{
          textAlign: 'center',
          position: 'sticky',
          top: '1rem'
        }}
      >
        <nav
          className={location.pathname !== `/missions/manage` ? 'active' : ''}
          onClick={() => history.push(`/missions`)}
          style={{
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Icon icon="clipboard-check" />
          <span style={{ marginLeft: '1.5rem' }}>Missions</span>
        </nav>
        <nav
          onClick={() => history.push(`/missions/${missionType}/manage`)}
          className={
            location.pathname === `/missions/${missionType}/manage`
              ? 'active'
              : ''
          }
          style={{
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Icon icon="tasks" />
          <span style={{ marginLeft: '1.5rem' }}>Manage</span>
        </nav>
      </div>
    </div>
  );
}
