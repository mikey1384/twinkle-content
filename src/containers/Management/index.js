import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import InvalidPage from 'components/InvalidPage';
import Routes from './Routes';
import Loading from 'components/Loading';
import SideMenu from 'components/SideMenu';
import Icon from 'components/Icon';
import { css } from '@emotion/css';
import { mobileMaxWidth } from 'constants/css';
import { NavLink } from 'react-router-dom';
import { useMyState } from 'helpers/hooks';
import { useManagementContext } from 'contexts';

Management.propTypes = {
  location: PropTypes.object
};

export default function Management({ location }) {
  const {
    state: { loaded },
    actions: { onLoadManagement }
  } = useManagementContext();
  const { loaded: userLoaded, managementLevel } = useMyState();
  useEffect(() => {
    onLoadManagement();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [managementLevel]);

  return !loaded || !userLoaded ? (
    <Loading />
  ) : managementLevel > 0 ? (
    <div>
      <SideMenu>
        <NavLink to="/subjects" activeClassName="active">
          <Icon icon="bolt" />
          <span style={{ marginLeft: '1.1rem' }}>Subjects</span>
        </NavLink>
        <NavLink to="/videos" activeClassName="active">
          <Icon icon="film" />
          <span style={{ marginLeft: '1.1rem' }}>Videos</span>
        </NavLink>
        <NavLink to="/links" activeClassName="active">
          <Icon icon="book" />
          <span style={{ marginLeft: '1.1rem' }}>Links</span>
        </NavLink>
      </SideMenu>
      <Routes
        className={css`
          width: CALC(100vw - 51rem - 2rem);
          margin-left: 20rem;
          display: flex;
          @media (max-width: ${mobileMaxWidth}) {
            width: 100%;
            margin-top: 0;
            margin-left: 0;
            margin-right: 0;
          }
        `}
        location={location}
      />
    </div>
  ) : (
    <InvalidPage
      title="For moderators only"
      text="You are not authorized to view this page"
    />
  );
}
