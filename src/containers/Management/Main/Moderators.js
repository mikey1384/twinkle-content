import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import SectionPanel from 'components/SectionPanel';
import Button from 'components/Button';
import Table from '../Table';
import AddModeratorModal from '../Modals/AddModeratorModal';
import EditModeratorModal from '../Modals/EditModeratorModal';
import { timeSince } from 'helpers/timeStampHelpers';
import { useManagementContext } from 'contexts';
import { useMyState } from 'helpers/hooks';

Moderators.propTypes = {
  canManage: PropTypes.bool.isRequired
};

export default function Moderators({ canManage }) {
  const { userId } = useMyState();
  const {
    state: { accountTypes, moderators, moderatorsLoaded }
  } = useManagementContext();
  const [addModeratorModalShown, setAddModeratorModalShown] = useState(false);
  const [moderatorModalTarget, setModeratorModalTarget] = useState(null);

  return (
    <ErrorBoundary>
      <SectionPanel
        title="Moderators"
        emptyMessage="No Moderators"
        loaded={moderatorsLoaded}
        style={{ paddingLeft: 0, paddingRight: 0 }}
        button={
          canManage ? (
            <Button
              color="darkerGray"
              skeuomorphic
              onClick={() => setAddModeratorModalShown(true)}
            >
              + Add Moderators
            </Button>
          ) : null
        }
      >
        <Table
          columns={`
            minmax(10rem, 1fr)
            minmax(15rem, 2fr)
            minmax(10rem, 1fr)
            minmax(15rem, 1fr)
            ${canManage ? 'minmax(17rem, 2fr)' : ''}
          `}
        >
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Online</th>
              <th>Account Type</th>
              {canManage && <th></th>}
            </tr>
          </thead>
          <tbody>
            {moderators.map((moderator) => (
              <tr
                key={moderator.id}
                style={{ cursor: canManage && 'pointer' }}
                onClick={() =>
                  canManage ? setModeratorModalTarget(moderator) : {}
                }
              >
                <td style={{ fontWeight: 'bold', fontSize: '1.6rem' }}>
                  {moderator.username}
                </td>
                <td>{moderator.email || 'Not Specified'}</td>
                <td>
                  {userId === moderator.id || moderator.online
                    ? 'now'
                    : timeSince(moderator.lastActive)}
                </td>
                <td
                  style={{
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  {moderator.userType}
                </td>
                {canManage && (
                  <td style={{ display: 'flex', justifyContent: 'center' }}>
                    <a>Change Account Type</a>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </Table>
      </SectionPanel>
      {addModeratorModalShown && (
        <AddModeratorModal
          accountTypes={accountTypes}
          onHide={() => setAddModeratorModalShown(false)}
        />
      )}
      {moderatorModalTarget && (
        <EditModeratorModal
          accountTypes={accountTypes}
          target={moderatorModalTarget}
          onHide={() => setModeratorModalTarget(null)}
        />
      )}
    </ErrorBoundary>
  );
}
