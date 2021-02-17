import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import SectionPanel from 'components/SectionPanel';
import Table from '../Table';
import RedTimes from '../RedTimes';
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
  const [banStatusModalTarget, setEditBanStatusModalTarget] = useState(null);

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
              <th style={{ textAlign: 'center' }}>Log In</th>
              <th style={{ textAlign: 'center' }}>Chat</th>
              <th style={{ textAlign: 'center' }}>Chess</th>
              <th style={{ textAlign: 'center' }}>Comment</th>
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
                  {banned.all && <RedTimes />}
                </td>
                <td style={{ textAlign: 'center' }}>
                  {banned.chat && <RedTimes />}
                </td>
                <td style={{ textAlign: 'center' }}>
                  {banned.chess && <RedTimes />}
                </td>
                <td style={{ textAlign: 'center' }}>
                  {banned.comment && <RedTimes />}
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
    </ErrorBoundary>
  );
}
