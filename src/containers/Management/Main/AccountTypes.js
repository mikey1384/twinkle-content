import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import SectionPanel from 'components/SectionPanel';
import Button from 'components/Button';
import Table from '../Table';
import Check from '../Check';
import AddAccountTypeModal from '../Modals/AddAccountTypeModal';
import EditAccountTypeModal from '../Modals/EditAccountTypeModal';
import Icon from 'components/Icon';
import { useMyState } from 'helpers/hooks';
import { useManagementContext } from 'contexts';

AccountTypes.propTypes = {
  canManage: PropTypes.bool.isRequired
};

export default function AccountTypes({ canManage }) {
  const { profileTheme } = useMyState();
  const {
    state: { accountTypes, accountTypesLoaded }
  } = useManagementContext();
  const [addAccountTypeModalShown, setAddAccountTypeModalShown] = useState(
    false
  );
  const [accountTypeModalTarget, setAccountTypeModalTarget] = useState(null);

  return (
    <ErrorBoundary>
      <SectionPanel
        title="Account Types"
        isEmpty={accountTypes.length === 0}
        emptyMessage="No Account Types"
        loaded={accountTypesLoaded}
        innerStyle={{ paddingLeft: 0, paddingRight: 0 }}
        button={
          canManage ? (
            <Button
              color="darkerGray"
              skeuomorphic
              onClick={() => setAddAccountTypeModalShown(true)}
            >
              <Icon icon="plus" />
              <span style={{ marginLeft: '0.7rem' }}>Add Account Type</span>
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
      {addAccountTypeModalShown && (
        <AddAccountTypeModal
          onHide={() => setAddAccountTypeModalShown(false)}
        />
      )}
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
    </ErrorBoundary>
  );
}
