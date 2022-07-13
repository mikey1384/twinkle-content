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
    content: { color: contentColor },
    link: { color: linkColor },
    mission: { color: missionColor },
    reward: { color: rewardColor }
  } = useTheme();
  const NotificationMessage = useMemo(() => {
    const isReply = targetComment?.userId === userId;
    const isSubjectResponse = targetSubject?.userId === userId;
    const params = {
      actionObj,
      contentColor,
      isNotification,
      isReply,
      isSubjectResponse,
      isTask,
      linkColor,
      missionColor,
      rewardColor,
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
    return SELECTED_LANGUAGE === 'kr'
      ? renderKoreanMessage(params)
      : renderEnglishMessage(params);
  }, [
    actionObj,
    contentColor,
    isNotification,
    isTask,
    linkColor,
    missionColor,
    rewardColor,
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
