import React from 'react';
import PropTypes from 'prop-types';
import UsernameText from 'components/Texts/UsernameText';
import ErrorBoundary from 'components/ErrorBoundary';
import { timeSince } from 'helpers/timeStampHelpers';
import { Color } from 'constants/css';
import { notiFeedListItem } from '../../Styles';
import useNotificationMessage from './useNotificationMessage';

NotiItem.propTypes = {
  notification: PropTypes.object.isRequired
};

export default function NotiItem({
  notification: {
    id,
    actionObj = {},
    targetComment = {},
    targetObj = {},
    targetSubject = {},
    timeStamp,
    user = {},
    rewardType,
    rewardRootId,
    rewardRootType,
    rewardRootMissionType,
    isNotification,
    isTask,
    rootMissionType
  }
}) {
  const NotificationMessage = useNotificationMessage({
    actionObj,
    isNotification,
    isTask,
    rewardRootId,
    rewardType,
    rewardRootMissionType,
    rewardRootType,
    rootMissionType,
    targetObj,
    targetComment,
    targetSubject
  });

  return (
    <ErrorBoundary>
      <nav style={{ background: '#fff' }} className={notiFeedListItem} key={id}>
        <div>
          {actionObj.contentType !== 'pass' &&
            actionObj.contentType !== 'fail' && (
              <>
                <UsernameText user={user} color={Color.blue()} />
                &nbsp;
              </>
            )}
          {NotificationMessage}
        </div>
        <small style={{ color: Color.gray() }}>{timeSince(timeStamp)}</small>
      </nav>
    </ErrorBoundary>
  );
}
