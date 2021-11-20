import { useMemo } from 'react';
import { useMyState } from 'helpers/hooks';
import renderEnglishMessage from './localize/english';
import renderKoreanMessage from './localize/korean';

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
  rootMissionType
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
      targetSubject
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
    userId
  ]);

  return NotificationMessage;
}
