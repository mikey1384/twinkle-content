import React, { useEffect, useMemo } from 'react';
import ErrorBoundary from 'components/ErrorBoundary';
import Moderators from './Moderators';
import AccountTypes from './AccountTypes';
import { useMyState } from 'helpers/hooks';
import { useAppContext, useManagementContext } from 'contexts';

export default function Main() {
  const { managementLevel } = useMyState();
  const canManage = useMemo(() => managementLevel > 1, [managementLevel]);
  const {
    requestHelpers: { loadAccountTypes, loadModerators }
  } = useAppContext();
  const {
    actions: { onLoadAccountTypes, onLoadModerators }
  } = useManagementContext();

  useEffect(() => {
    initModerators();
    initAccountTypes();
    async function initModerators() {
      const moderators = await loadModerators();
      onLoadModerators(moderators);
    }
    async function initAccountTypes() {
      const data = await loadAccountTypes();
      onLoadAccountTypes(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ErrorBoundary>
      <Moderators canManage={canManage} />
      <AccountTypes canManage={canManage} />
    </ErrorBoundary>
  );
}
