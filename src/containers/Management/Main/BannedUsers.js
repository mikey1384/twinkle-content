import React from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import SectionPanel from 'components/SectionPanel';
import Table from '../Table';
import Check from '../Check';
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
          minmax(10rem, 1.5fr)
          minmax(15rem, 1.5fr)
          minmax(10rem, 1fr)
          minmax(10rem, 1.2fr)
          minmax(10rem, 1.1fr)
        `}
        >
          <thead>
            <tr>
              <th>Banned Features</th>
              <th style={{ textAlign: 'center' }}>All</th>
              <th style={{ textAlign: 'center' }}>Chat</th>
              <th style={{ textAlign: 'center' }}>Chess</th>
              <th style={{ textAlign: 'center' }}>Comment</th>
            </tr>
          </thead>
          <tbody>
            {bannedUsers.map((bannedUser) => (
              <tr
                onClick={() => (canManage ? console.log('can manage') : {})}
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
                  <Check checked={!!bannedUser.banned.all} />
                </td>
                <td style={{ textAlign: 'center' }}>
                  <Check checked={!!bannedUser.banned.chat} />
                </td>
                <td style={{ textAlign: 'center' }}>
                  <Check checked={!!bannedUser.banned.chess} />
                </td>
                <td style={{ textAlign: 'center' }}>
                  <Check checked={!!bannedUser.banned.comment} />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </SectionPanel>
    </ErrorBoundary>
  );
}
