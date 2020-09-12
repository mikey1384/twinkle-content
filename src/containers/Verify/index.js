import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';
import InvalidPage from 'components/InvalidPage';
import Email from './Email';

Verify.propTypes = {
  match: PropTypes.object.isRequired
};

export default function Verify({ match }) {
  return (
    <Switch>
      <Route path={`${match.path}/email/:token`} component={Email} />
      <Route component={InvalidPage} />
    </Switch>
  );
}
