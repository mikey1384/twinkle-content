import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import renderEnglishText from './localization/english';
import { timeSince } from 'helpers/timeStampHelpers';
import { notiFeedListItem } from '../../Styles';

RewardItem.propTypes = {
  reward: PropTypes.object.isRequired
};

export default function RewardItem({
  reward: {
    id,
    isTask,
    contentId,
    contentType,
    rootId,
    rootType,
    rootMissionType,
    rewardAmount,
    rewardType,
    rewarderId,
    rewarderUsername,
    targetObj,
    timeStamp
  }
}) {
  const NotiText = useMemo(() => {
    return renderEnglishText({
      contentId,
      contentType,
      isTask,
      rewardAmount,
      rewardType,
      rewarderId,
      rewarderUsername,
      rootId,
      rootMissionType,
      rootType,
      targetObj
    });
  }, [
    contentId,
    contentType,
    isTask,
    rewardAmount,
    rewardType,
    rewarderId,
    rewarderUsername,
    rootId,
    rootMissionType,
    rootType,
    targetObj
  ]);

  return (
    <nav style={{ background: '#fff' }} className={notiFeedListItem} key={id}>
      {NotiText}
      <small>{timeSince(timeStamp)}</small>
    </nav>
  );
}
