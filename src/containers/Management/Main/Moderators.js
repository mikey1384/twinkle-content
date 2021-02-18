import React, { useMemo, useState } from 'react';
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
import LoadMoreButton from 'components/Buttons/LoadMoreButton';
import Icon from 'components/Icon';

Moderators.propTypes = {
  canManage: PropTypes.bool.isRequired
};

export default function Moderators({ canManage }) {
  const { userId, profileTheme } = useMyState();
  const {
    state: { accountTypes, moderators, moderatorsLoaded, numModeratorsShown },
    actions: { onLoadMoreModerators }
  } = useManagementContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [addModeratorModalShown, setAddModeratorModalShown] = useState(false);
  const [moderatorModalTarget, setModeratorModalTarget] = useState(null);
  const filteredModerators = useMemo(() => {
    return moderators.filter((moderator) =>
      searchQuery ? moderator.username.includes(searchQuery) : moderator
    );
  }, [moderators, searchQuery]);

  return (
    <ErrorBoundary>
      <SectionPanel
        title="Moderators"
        isEmpty={moderators.length === 0}
        emptyMessage="No Moderators"
        searchPlaceholder="Search Moderators"
        onSearch={setSearchQuery}
        searchQuery={searchQuery}
        loaded={moderatorsLoaded}
        innerStyle={{ paddingLeft: 0, paddingRight: 0 }}
        button={
          canManage ? (
            <Button
              color="darkerGray"
              skeuomorphic
              onClick={() => setAddModeratorModalShown(true)}
            >
              <Icon icon="plus" />
              <span style={{ marginLeft: '0.7rem' }}>Add Moderators</span>
            </Button>
          ) : null
        }
      >
        <Table
          color={profileTheme}
          columns={`
            minmax(15rem, 1.5fr)
            minmax(10rem, 1fr)
            minmax(15rem, 1fr)
            ${canManage ? 'minmax(17rem, 2fr)' : ''}
          `}
        >
          <thead>
            <tr>
              <th>User</th>
              <th>Online</th>
              <th>Account Type</th>
              {canManage && <th></th>}
            </tr>
          </thead>
          <tbody>
            {filteredModerators
              .filter((moderator, index) => index < numModeratorsShown)
              .map((moderator) => (
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
        {moderators.length > numModeratorsShown && (
          <div
            style={{
              marginTop: '2rem',
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <LoadMoreButton
              transparent
              style={{ fontSize: '2rem' }}
              onClick={onLoadMoreModerators}
            />
          </div>
        )}
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
