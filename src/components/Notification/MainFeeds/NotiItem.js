import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import UsernameText from 'components/Texts/UsernameText';
import ErrorBoundary from 'components/ErrorBoundary';
import ContentLink from 'components/ContentLink';
import { timeSince } from 'helpers/timeStampHelpers';
import { Color } from 'constants/css';
import { truncateText, stringIsEmpty } from 'helpers/stringHelpers';
import { useMyState } from 'helpers/hooks';
import { notiFeedListItem } from '../Styles';

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
  const { userId } = useMyState();
  const NotificationMessage = useMemo(() => {
    let notificationMessage;
    const isReply = targetComment?.userId === userId;
    const isSubjectResponse = targetSubject?.userId === userId;
    switch (actionObj.contentType) {
      case 'like':
        notificationMessage = (
          <>
            <span style={{ color: Color.lightBlue(), fontWeight: 'bold' }}>
              likes
            </span>{' '}
            <span>your</span>{' '}
            <ContentLink
              contentType={targetObj.contentType}
              content={{
                id: targetObj.id,
                title: `${
                  targetObj.contentType === 'url'
                    ? 'link'
                    : targetObj.contentType
                } ${
                  !stringIsEmpty(targetObj.content)
                    ? `(${truncateText({
                        text: targetObj.content,
                        limit: 100
                      })})`
                    : ''
                }`
              }}
            />
          </>
        );
        break;
      case 'recommendation':
        notificationMessage = (
          <>
            <span style={{ color: Color.brownOrange(), fontWeight: 'bold' }}>
              recommended
            </span>{' '}
            <span>your</span>{' '}
            <ContentLink
              contentType={targetObj.contentType}
              content={{
                id: targetObj.id,
                title: `${
                  targetObj.contentType === 'url'
                    ? 'link'
                    : targetObj.contentType
                } ${
                  stringIsEmpty(targetObj.content)
                    ? ''
                    : `(${truncateText({
                        text: targetObj.content,
                        limit: 100
                      })})`
                }`
              }}
            />
          </>
        );
        break;
      case 'reward': {
        if (rewardType === 'Twinkle') {
          notificationMessage = (
            <>
              <span
                style={{
                  color:
                    actionObj.amount >= 10
                      ? Color.rose()
                      : actionObj.amount >= 5
                      ? Color.orange()
                      : actionObj.amount >= 3
                      ? Color.pink()
                      : Color.lightBlue(),
                  fontWeight: 'bold'
                }}
              >
                rewarded you {actionObj.amount === 1 ? 'a' : actionObj.amount}{' '}
                Twinkle
                {actionObj.amount > 1 ? 's' : ''}
              </span>{' '}
              for your{' '}
              <ContentLink
                contentType={targetObj.contentType}
                content={{
                  id: targetObj.id,
                  title: `${
                    targetObj.contentType === 'url'
                      ? 'link'
                      : targetObj.contentType
                  } ${
                    stringIsEmpty(targetObj.content)
                      ? ''
                      : `(${truncateText({
                          text: targetObj.content,
                          limit: 100
                        })})`
                  }`
                }}
              />
            </>
          );
        } else {
          notificationMessage = (
            <>
              <b style={{ color: Color.pink() }}>also recommended</b>{' '}
              <ContentLink
                style={{ color: Color.green() }}
                content={{
                  id: rewardRootId,
                  title: `this ${
                    rewardRootType === 'pass'
                      ? isTask
                        ? 'task'
                        : 'mission'
                      : rewardRootType
                  }`,
                  missionType: rewardRootMissionType
                }}
                contentType={
                  rewardRootType === 'pass' ? 'mission' : rewardRootType
                }
              />{' '}
              <p style={{ fontWeight: 'bold', color: Color.brownOrange() }}>
                You earn {actionObj.amount} Twinkle Coin
                {actionObj.amount > 1 ? 's' : ''}!
              </p>
            </>
          );
        }
        break;
      }
      case 'comment':
        notificationMessage = isNotification ? (
          <>
            viewed your{' '}
            <ContentLink
              contentType="subject"
              content={{
                id: targetSubject.id,
                title: `subject`
              }}
            />
            {`'s secret message`}
          </>
        ) : (
          <>
            <ContentLink
              contentType="comment"
              content={{
                id: actionObj.id,
                title: isReply
                  ? 'replied to'
                  : targetObj.contentType === 'user'
                  ? 'left a message on'
                  : 'commented on'
              }}
              style={{ color: Color.green() }}
            />{' '}
            your{' '}
            <ContentLink
              contentType={
                isReply
                  ? 'comment'
                  : isSubjectResponse
                  ? 'subject'
                  : targetObj.contentType
              }
              content={{
                id: isReply
                  ? targetComment.id
                  : isSubjectResponse
                  ? targetSubject.id
                  : targetObj.id,
                username: targetObj.content,
                title: `${
                  isReply
                    ? 'comment'
                    : isSubjectResponse
                    ? 'subject'
                    : targetObj.contentType === 'user'
                    ? 'profile'
                    : targetObj.contentType === 'url'
                    ? 'link'
                    : targetObj.contentType
                }${
                  !isReply && targetObj.contentType === 'user'
                    ? ''
                    : ` (${truncateText({
                        text: isReply
                          ? targetComment.content
                          : isSubjectResponse
                          ? targetSubject.content
                          : targetObj.content,
                        limit: 100
                      })})`
                }`
              }}
            />
            {!stringIsEmpty(actionObj.content) && (
              <>
                :{' '}
                <ContentLink
                  contentType="comment"
                  content={{
                    id: actionObj.id,
                    title: `"${truncateText({
                      text: actionObj.content,
                      limit: 100
                    })}"`
                  }}
                  style={{ color: Color.green() }}
                />
              </>
            )}
          </>
        );
        break;
      case 'subject':
        notificationMessage = (
          <>
            <span>added a </span>
            <ContentLink
              contentType="subject"
              content={{
                id: actionObj.id,
                title: `subject (${truncateText({
                  text: actionObj.content,
                  limit: 100
                })})`
              }}
              style={{ color: Color.green() }}
            />{' '}
            <span>to your </span>
            <ContentLink
              contentType={targetObj.contentType}
              content={{
                id: targetObj.id,
                title: `${
                  targetObj.contentType === 'url'
                    ? 'link'
                    : targetObj.contentType
                } (${truncateText({ text: targetObj.content, limit: 100 })})`
              }}
            />
          </>
        );
        break;
      case 'pass':
        notificationMessage = (
          <>
            <b style={{ color: Color.brownOrange() }}>Mission accomplished!</b>{' '}
            <ContentLink
              contentType="mission"
              content={{
                id: targetObj.id,
                missionType: rootMissionType || targetObj.missionType,
                title: `(${truncateText({
                  text: targetObj.content,
                  limit: 100
                })})`
              }}
              style={{ color: Color.blue() }}
            />
          </>
        );
        break;
      case 'fail':
        notificationMessage = (
          <>
            <b style={{ color: Color.darkerGray() }}>Mission failed...</b>{' '}
            <ContentLink
              contentType="mission"
              content={{
                id: targetObj.id,
                missionType: targetObj.missionType,
                title: `(${truncateText({
                  text: targetObj.content,
                  limit: 100
                })})`
              }}
              style={{ color: Color.blue() }}
            />
          </>
        );
        break;
      default:
        notificationMessage = (
          <span>There was an error - report to Mikey!</span>
        );
        break;
    }
    return notificationMessage;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    actionObj.amount,
    actionObj.content,
    actionObj.contentType,
    actionObj.id,
    targetComment,
    targetObj.content,
    targetObj.contentType,
    targetObj.id,
    targetSubject,
    userId
  ]);

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
