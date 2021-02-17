import React, { useEffect, useMemo } from 'react';
import ErrorBoundary from 'components/ErrorBoundary';
import Moderators from './Moderators';
import AccountTypes from './AccountTypes';
import BannedUsers from './BannedUsers';
import { useMyState } from 'helpers/hooks';
import { useAppContext, useManagementContext } from 'contexts';

export default function Main() {
  const { managementLevel } = useMyState();
  const canManage = useMemo(() => managementLevel > 1, [managementLevel]);
  const {
    requestHelpers: { loadAccountTypes, loadBannedUsers, loadModerators }
  } = useAppContext();
  const {
    actions: { onLoadAccountTypes, onLoadBannedUsers, onLoadModerators }
  } = useManagementContext();

  useEffect(() => {
    initModerators();
    initAccountTypes();
    initBannedUsers();
    async function initModerators() {
      const moderators = await loadModerators();
      onLoadModerators(moderators);
    }
    async function initAccountTypes() {
      const data = await loadAccountTypes();
      onLoadAccountTypes(data);
    }
    async function initBannedUsers() {
      const data = await loadBannedUsers();
      onLoadBannedUsers(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ErrorBoundary style={{ paddingBottom: '10rem' }}>
      <Moderators canManage={canManage} />
      <AccountTypes canManage={canManage} />
      <BannedUsers canManage={canManage} />
    </ErrorBoundary>
  );
}
