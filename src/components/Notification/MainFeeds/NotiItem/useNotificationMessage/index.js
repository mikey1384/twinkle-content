import { useMemo } from 'react';
import renderEnglishMessage from './localization/english';
import renderKoreanMessage from './localization/korean';
import { useKeyContext } from 'contexts';
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
  const { userId } = useKeyContext((v) => v.myState);
  const {
    action: { color: actionColor },
    info: { color: infoColor },
    link: { color: linkColor },
    mention: { color: mentionColor },
    mission: { color: missionColor },
    reward: { color: rewardColor }
  } = useKeyContext((v) => v.theme);
  const NotificationMessage = useMemo(() => {
    const isReply = targetComment?.userId === userId;
    const isSubjectResponse = targetSubject?.userId === userId;
    const params = {
      actionObj,
      actionColor,
      infoColor,
      isNotification,
      isReply,
      isSubjectResponse,
      isTask,
      linkColor,
      mentionColor,
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
    actionColor,
    infoColor,
    isNotification,
    isTask,
    linkColor,
    mentionColor,
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
