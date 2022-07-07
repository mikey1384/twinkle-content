import { useMemo } from 'react';
import { useMyState, useTheme } from 'helpers/hooks';
import renderEnglishMessage from './localization/english';
import renderKoreanMessage from './localization/korean';
import { SELECTED_LANGUAGE } from 'constants/defaultValues';

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
  const {
    comment: { color: commentColor },
    mission: { color: missionColor },
    subject: { color: subjectColor }
  } = useTheme();
  const NotificationMessage = useMemo(() => {
    const isReply = targetComment?.userId === userId;
    const isSubjectResponse = targetSubject?.userId === userId;
    const params = {
      actionObj,
      commentColor,
      isNotification,
      isReply,
      isSubjectResponse,
      isTask,
      missionColor,
      rewardRootId,
      rewardType,
      rewardRootMissionType,
      rewardRootType,
      rootMissionType,
      subjectColor,
      targetComment,
      targetObj,
      targetSubject,
      user
    };
    return SELECTED_LANGUAGE === 'kr'
      ? renderKoreanMessage(params)
      : renderEnglishMessage(params);
  }, [
    actionObj,
    commentColor,
    isNotification,
    isTask,
    missionColor,
    rewardRootId,
    rewardRootMissionType,
    rewardRootType,
    rewardType,
    rootMissionType,
    subjectColor,
    targetComment,
    targetObj,
    targetSubject,
    user,
    userId
  ]);

  return NotificationMessage;
}
