import React from 'react';
import PropTypes from 'prop-types';
import Main from './Main';
import Notification from 'components/Notification';
import ModActivities from './ModActivities';
import { css } from '@emotion/css';
import { mobileMaxWidth } from 'constants/css';
import { Route, Routes } from 'react-router-dom';

ManagementRoutes.propTypes = {
  className: PropTypes.string,
  location: PropTypes.object
};

export default function ManagementRoutes({ location, className }) {
  return (
    <div className={className}>
      <div
        className={css`
          margin-top: 1rem;
          width: CALC(100vw - 54rem);
          margin-left: 1rem;
          @media (max-width: ${mobileMaxWidth}) {
            margin-left: 0;
            width: 100%;
          }
        `}
      >
        <Routes>
          <Route path="/management" exact element={<Main />} />
          <Route
            path="/management/mod-activities"
            element={<ModActivities />}
          />
        </Routes>
      </div>
      <Notification
        className={css`
          width: 31rem;
          overflow-y: scroll;
          -webkit-overflow-scrolling: touch;
          right: 1rem;
          top: 4.5rem;
          bottom: 0;
          position: absolute;
          @media (max-width: ${mobileMaxWidth}) {
            display: none;
          }
        `}
        location={location.pathname.substring(1)}
      />
    </div>
  );
}
