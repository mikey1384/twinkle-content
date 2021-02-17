import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import SectionPanel from 'components/SectionPanel';
import Table from '../Table';
import Icon from 'components/Icon';
import { Color } from 'constants/css';
import { useManagementContext } from 'contexts';
import { useMyState } from 'helpers/hooks';
import EditBanStatusModal from '../Modals/EditBanStatusModal';

BannedUsers.propTypes = {
  canManage: PropTypes.bool
};

export default function BannedUsers({ canManage }) {
  const {
    state: { bannedUsers, bannedUsersLoaded }
  } = useManagementContext();
  const { profileTheme } = useMyState();
  const [banStatusModalShown, setEditBanStatusModalShown] = useState(false);

  return (
    <ErrorBoundary>
      <SectionPanel
        title="Restricted Users"
        emptyMessage="No Restricted Users"
        loaded={bannedUsersLoaded}
        innerStyle={{ paddingLeft: 0, paddingRight: 0 }}
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
              <th style={{ textAlign: 'center' }}>All</th>
              <th style={{ textAlign: 'center' }}>Chat</th>
              <th style={{ textAlign: 'center' }}>Chess</th>
              <th style={{ textAlign: 'center' }}>Comment</th>
            </tr>
          </thead>
          <tbody>
            {bannedUsers.map((bannedUser) => (
              <tr
                onClick={() =>
                  canManage ? setEditBanStatusModalShown(true) : {}
                }
                key={bannedUser.id}
                style={{ cursor: canManage && 'pointer' }}
              >
                <td
                  style={{
                    fontWeight: 'bold',
                    fontSize: '1.6rem'
                  }}
                >
                  {bannedUser.username}
                </td>
                <td style={{ textAlign: 'center' }}>
                  {bannedUser.banned.all && (
                    <Icon icon="times" style={{ color: Color.rose() }} />
                  )}
                </td>
                <td style={{ textAlign: 'center' }}>
                  {bannedUser.banned.chat && (
                    <Icon icon="times" style={{ color: Color.rose() }} />
                  )}
                </td>
                <td style={{ textAlign: 'center' }}>
                  {bannedUser.banned.chess && (
                    <Icon icon="times" style={{ color: Color.rose() }} />
                  )}
                </td>
                <td style={{ textAlign: 'center' }}>
                  {bannedUser.banned.comment && (
                    <Icon icon="times" style={{ color: Color.rose() }} />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </SectionPanel>
      {banStatusModalShown && (
        <EditBanStatusModal onHide={() => setEditBanStatusModalShown(false)} />
      )}
    </ErrorBoundary>
  );
}
