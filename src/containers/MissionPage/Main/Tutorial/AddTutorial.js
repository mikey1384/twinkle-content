import React from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import Icon from 'components/Icon';
import { panel } from '../../Styles';
import { useAppContext, useMissionContext } from 'contexts';

AddTutorial.propTypes = {
  missionId: PropTypes.number,
  missionTitle: PropTypes.string
};

export default function AddTutorial({ missionId, missionTitle }) {
  const {
    requestHelpers: { attachMissionTutorial }
  } = useAppContext();
  const {
    actions: { onSetMissionState }
  } = useMissionContext();
  return (
    <div
      className={panel}
      style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
    >
      <Button skeuomorphic onClick={handleAttachTutorial}>
        <Icon icon="plus" />
        <span style={{ marginLeft: '0.7rem' }}>Attach a Tutorial</span>
      </Button>
    </div>
  );

  async function handleAttachTutorial() {
    const tutorialId = await attachMissionTutorial({ missionId, missionTitle });
    onSetMissionState({ missionId, newState: { tutorialId } });
  }
}
