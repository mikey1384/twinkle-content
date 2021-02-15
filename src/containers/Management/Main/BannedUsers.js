import React from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import SectionPanel from 'components/SectionPanel';
import { useManagementContext } from 'contexts';

BannedUsers.propTypes = {
  canManage: PropTypes.bool
};

export default function BannedUsers({ canManage }) {
  const {
    state: { bannedUsers, bannedUsersLoaded }
  } = useManagementContext();

  return (
    <ErrorBoundary>
      <SectionPanel
        title="Restricted Users"
        emptyMessage="No Restricted Users"
        loaded={bannedUsersLoaded}
        innerStyle={{ paddingLeft: 0, paddingRight: 0 }}
      >
        {bannedUsers} {canManage}
      </SectionPanel>
    </ErrorBoundary>
  );
}
