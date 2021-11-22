import { useMemo } from 'react';
import { useMyState } from 'helpers/hooks';
import renderEnglishMessage from './localization/english';
import renderKoreanMessage from './localization/korean';

const selectedLanguage = process.env.REACT_APP_SELECTED_LANGUAGE;

export default function useNotificationMessage({
  actionObj,
  targetObj,
  targetComment,
  targetSubject,
  isNotification,
  isTask,
  rewardRootId,
  rewardType,
  rewardRootMissionType,
  rewardRootType,
  rootMissionType,
  user
}) {
  const { userId } = useMyState();
  const NotificationMessage = useMemo(() => {
    const isReply = targetComment?.userId === userId;
    const isSubjectResponse = targetSubject?.userId === userId;
    const params = {
      actionObj,
      isNotification,
      isReply,
      isSubjectResponse,
      isTask,
      rewardRootId,
      rewardType,
      rewardRootMissionType,
      rewardRootType,
      rootMissionType,
      targetComment,
      targetObj,
      targetSubject,
      user
    };
    return selectedLanguage === 'en'
      ? renderEnglishMessage(params)
      : renderKoreanMessage(params);
  }, [
    actionObj,
    isNotification,
    isTask,
    rewardRootId,
    rewardRootMissionType,
    rewardRootType,
    rewardType,
    rootMissionType,
    targetComment,
    targetObj,
    targetSubject,
    user,
    userId
  ]);

  return NotificationMessage;
}
