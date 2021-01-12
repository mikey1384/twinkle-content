import React, { useEffect, useMemo, useState } from 'react';
import Button from 'components/Button';
import EditAccountTypeModal from '../Modals/EditAccountTypeModal';
import AddAccountTypeModal from '../Modals/AddAccountTypeModal';
import ErrorBoundary from 'components/ErrorBoundary';
import Table from '../Table';
import Check from '../Check';
import Moderators from './Moderators';
import SectionPanel from 'components/SectionPanel';
import { useMyState } from 'helpers/hooks';
import { useAppContext, useManagementContext } from 'contexts';

export default function Main() {
  const { managementLevel, profileTheme } = useMyState();
  const canManage = useMemo(() => managementLevel > 1, [managementLevel]);
  const {
    requestHelpers: { loadAccountTypes, loadModerators }
  } = useAppContext();
  const {
    state: { accountTypes, accountTypesLoaded },
    actions: { onLoadAccountTypes, onLoadModerators }
  } = useManagementContext();
  const [accountTypeModalTarget, setAccountTypeModalTarget] = useState(null);
  const [addAccountTypeModalShown, setAddAccountTypeModalShown] = useState(
    false
  );
  useEffect(() => {
    initModerators();
    initAccountTypes();
    async function initModerators() {
      const data = await loadModerators();
      onLoadModerators(data);
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
      <SectionPanel
        title="Account Types"
        emptyMessage="No Account Types"
        loaded={accountTypesLoaded}
        style={{ paddingLeft: 0, paddingRight: 0 }}
        button={
          canManage ? (
            <Button
              color="darkerGray"
              skeuomorphic
              onClick={() => setAddAccountTypeModalShown(true)}
            >
              + Add Account Type
            </Button>
          ) : null
        }
      >
        <Table
          color={profileTheme}
          headerFontSize="1.5rem"
          columns={`
            minmax(10rem, 1.5fr)
            minmax(15rem, 1.5fr)
            minmax(10rem, 1fr)
            minmax(10rem, 1.2fr)
            minmax(10rem, 1.1fr)
            minmax(17rem, 2fr)
            minmax(15rem, 1.6fr)
            minmax(17rem, 2fr)
          `}
        >
          <thead>
            <tr>
              <th>Label</th>
              <th style={{ textAlign: 'center' }}>Auth Level</th>
              <th style={{ textAlign: 'center' }}>Edit</th>
              <th style={{ textAlign: 'center' }}>Delete</th>
              <th style={{ textAlign: 'center' }}>Reward</th>
              <th style={{ textAlign: 'center' }}>Feature Contents</th>
              <th style={{ textAlign: 'center' }}>Edit Playlists</th>
              <th style={{ textAlign: 'center' }}>Edit Reward Level</th>
            </tr>
          </thead>
          <tbody>
            {accountTypes.map((accountType) => (
              <tr
                onClick={() =>
                  canManage ? setAccountTypeModalTarget(accountType.label) : {}
                }
                key={accountType.label}
                style={{ cursor: canManage && 'pointer' }}
              >
                <td
                  style={{
                    fontWeight: 'bold',
                    fontSize: '1.6rem'
                  }}
                >
                  {accountType.label}
                </td>
                <td style={{ textAlign: 'center' }}>{accountType.authLevel}</td>
                <td style={{ textAlign: 'center' }}>
                  <Check checked={!!accountType.canEdit} />
                </td>
                <td style={{ textAlign: 'center' }}>
                  <Check checked={!!accountType.canDelete} />
                </td>
                <td style={{ textAlign: 'center' }}>
                  <Check checked={!!accountType.canReward} />
                </td>
                <td style={{ textAlign: 'center' }}>
                  <Check checked={!!accountType.canPinPlaylists} />
                </td>
                <td style={{ textAlign: 'center' }}>
                  <Check checked={!!accountType.canEditPlaylists} />
                </td>
                <td style={{ textAlign: 'center' }}>
                  <Check checked={!!accountType.canEditRewardLevel} />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </SectionPanel>
      {accountTypeModalTarget && (
        <EditAccountTypeModal
          target={
            accountTypes.filter(
              (accountType) => accountType.label === accountTypeModalTarget
            )[0]
          }
          onHide={() => setAccountTypeModalTarget(null)}
        />
      )}
      {addAccountTypeModalShown && (
        <AddAccountTypeModal
          onHide={() => setAddAccountTypeModalShown(false)}
        />
      )}
    </ErrorBoundary>
  );
}
