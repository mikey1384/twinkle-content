import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import InvalidPage from 'components/InvalidPage';
import { css } from '@emotion/css';
import { mobileMaxWidth } from 'constants/css';
import Content from './Content';

Playlists.propTypes = {
  match: PropTypes.object.isRequired
};

export default function Playlists({ match }) {
  return (
    <div
      className={css`
        width: 100%;
        display: flex;
        justify-content: center;
        margin-top: 1rem;
        margin-bottom: 1rem;
        padding-bottom: 20rem;
        @media (max-width: ${mobileMaxWidth}) {
          margin-top: 0;
        }
      `}
    >
      <section
        className={css`
          width: 65%;
          @media (max-width: ${mobileMaxWidth}) {
            width: 100%;
            min-height: 100vh;
          }
        `}
      >
        <Switch>
          <Route exact path={`${match.url}/:contentId`} component={Content} />
          <Route component={InvalidPage} />
        </Switch>
      </section>
    </div>
  );
}
