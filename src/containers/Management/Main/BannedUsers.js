import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import SectionPanel from 'components/SectionPanel';
import Table from '../Table';
import RedTimes from '../RedTimes';
import EditBanStatusModal from '../Modals/EditBanStatusModal';
import AddBanModal from '../Modals/AddBanModal';
import Button from 'components/Button';
import Icon from 'components/Icon';
import { useManagementContext } from 'contexts';
import { useMyState } from 'helpers/hooks';

BannedUsers.propTypes = {
  canManage: PropTypes.bool
};

export default function BannedUsers({ canManage }) {
  const {
    state: { bannedUsers, bannedUsersLoaded }
  } = useManagementContext();
  const { profileTheme } = useMyState();
  const [newBanModalShown, setNewBanModalShown] = useState(false);
  const [banStatusModalTarget, setEditBanStatusModalTarget] = useState(null);

  return (
    <ErrorBoundary>
      <SectionPanel
        title="Restricted Accounts"
        isEmpty={bannedUsers.length === 0}
        emptyMessage="No Restricted Accounts"
        loaded={bannedUsersLoaded}
        innerStyle={{ paddingLeft: 0, paddingRight: 0 }}
        button={
          canManage ? (
            <Button
              color="darkerGray"
              skeuomorphic
              onClick={() => setNewBanModalShown(true)}
            >
              <Icon icon="plus" />
              <span style={{ marginLeft: '0.7rem' }}>Restrict Account</span>
            </Button>
          ) : null
        }
      >
        <Table
          color={profileTheme}
          headerFontSize="1.5rem"
          columns={`
          minmax(10rem, 1fr)
          minmax(10rem, 1fr)
          minmax(10rem, 1fr)
          minmax(10rem, 1fr)
          minmax(10rem, 1fr)
        `}
        >
          <thead>
            <tr>
              <th>Users</th>
              <th style={{ textAlign: 'center' }}>Log In</th>
              <th style={{ textAlign: 'center' }}>Chat</th>
              <th style={{ textAlign: 'center' }}>Chess</th>
              <th style={{ textAlign: 'center' }}>Posting</th>
            </tr>
          </thead>
          <tbody>
            {bannedUsers.map(({ id, username, banned }) => (
              <tr
                onClick={() =>
                  canManage
                    ? setEditBanStatusModalTarget({ id, username, banned })
                    : {}
                }
                key={id}
                style={{ cursor: canManage && 'pointer' }}
              >
                <td
                  style={{
                    fontWeight: 'bold',
                    fontSize: '1.6rem'
                  }}
                >
                  {username}
                </td>
                <td style={{ textAlign: 'center' }}>
                  {banned?.all && <RedTimes />}
                </td>
                <td style={{ textAlign: 'center' }}>
                  {banned?.chat && <RedTimes />}
                </td>
                <td style={{ textAlign: 'center' }}>
                  {banned?.chess && <RedTimes />}
                </td>
                <td style={{ textAlign: 'center' }}>
                  {banned?.posting && <RedTimes />}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </SectionPanel>
      {banStatusModalTarget && (
        <EditBanStatusModal
          target={banStatusModalTarget}
          onHide={() => setEditBanStatusModalTarget(null)}
        />
      )}
      {newBanModalShown && (
        <AddBanModal onHide={() => setNewBanModalShown(false)} />
      )}
    </ErrorBoundary>
  );
}
