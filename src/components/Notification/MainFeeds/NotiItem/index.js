import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import { timeSince } from 'helpers/timeStampHelpers';
import { Color } from 'constants/css';
import { notiFeedListItem } from '../../Styles';
import { SELECTED_LANGUAGE } from 'constants/defaultValues';
import { useKeyContext } from 'contexts';
import useNotificationMessage from './useNotificationMessage';
import UsernameText from 'components/Texts/UsernameText';

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
  const {
    link: { color: linkColor }
  } = useKeyContext((v) => v.theme);
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
    targetSubject,
    user
  });
  const userLabel = useMemo(() => {
    if (actionObj.contentType !== 'pass' && actionObj.contentType !== 'fail') {
      return (
        <div style={{ display: 'inline' }}>
          <UsernameText user={user} color={Color[linkColor]()} />
          {SELECTED_LANGUAGE === 'kr' ? '' : ' '}
        </div>
      );
    }
    return '';
  }, [actionObj.contentType, linkColor, user]);

  return (
    <ErrorBoundary componentPath="Notification/MainFeeds/NotiItem/index">
      <nav style={{ background: '#fff' }} className={notiFeedListItem} key={id}>
        <div>
          {userLabel}
          {NotificationMessage}
        </div>
        <small style={{ color: Color.gray() }}>{timeSince(timeStamp)}</small>
      </nav>
    </ErrorBoundary>
  );
}
