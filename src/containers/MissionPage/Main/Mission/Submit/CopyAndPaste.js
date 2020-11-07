import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Input from 'components/Texts/Input';
import Button from 'components/Button';
import { stringIsEmpty } from 'helpers/stringHelpers';
import { Color, mobileMaxWidth } from 'constants/css';
import { useAppContext, useContentContext, useMissionContext } from 'contexts';
import { useMyState } from 'helpers/hooks';
import { css } from 'emotion';

const missionText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce luctus
commodo purus eget tempus. In suscipit euismod ex, sit amet maximus sem
egestas ac. Duis libero massa, Miguel molestie imperdiet a neque et, posuere aliquam
metus. Curabitur rhoncus semper augue, sit amet placerat libero mattis
eu. Donec id nulla venenatis, eleifend enim quis, placerat est. Nulla
facilisi. Dolor sed odio cursus et eu ligula.
Suspendisse, id dictum massa is actually finibus eu. Cras
cheese tempus sagittis commodo iaculis stick. Nunc consectetur ut mi vel pharetra. Integer
posuere diam at nulla porttitor suscipit. Aliquam eget ligula non turpis
ultrices pulvinar in in mi. Sed fermentum Twinkle libero sed nisl feugiat
rhoncus. Etiam fringilla porta feugiat. Donec et arcu venenatis, pretium
nulla ut, convallis rocks odio.`.replace(/\n/gi, ' ');

CopyAndPaste.propTypes = {
  mission: PropTypes.object.isRequired,
  onSetMissionState: PropTypes.func.isRequired,
  style: PropTypes.object
};

export default function CopyAndPaste({ mission, onSetMissionState, style }) {
  const { userId } = useMyState();
  const {
    requestHelpers: { uploadMissionAttempt }
  } = useAppContext();
  const {
    actions: { onUpdateMissionAttempt }
  } = useMissionContext();
  const {
    actions: { onChangeUserXP, onUpdateUserCoins }
  } = useContentContext();

  const { content = '' } = mission;
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (!stringIsEmpty(content)) {
      setStatus(
        content.localeCompare(missionText) === 0
          ? 'pass'
          : content.localeCompare(missionText) === -1
          ? 'too short'
          : 'too long'
      );
    } else {
      setStatus('');
    }
  }, [content]);

  return (
    <div style={style}>
      <div
        className={css`
          font-size: 1.7rem;
          @media (max-width: ${mobileMaxWidth}) {
            font-size: 1.5rem;
          }
        `}
      >
        {missionText}
      </div>
      <Input
        autoFocus
        value={content}
        onChange={(text) =>
          onSetMissionState({
            missionId: mission.id,
            newState: { content: text.trim() }
          })
        }
        style={{ marginTop: '3rem' }}
        placeholder="Paste the text here..."
      />

      {!stringIsEmpty(status) && (
        <div
          style={{
            marginTop: '1rem',
            marginBottom: '-2rem',
            display: 'flex',
            justifyContent: 'flex-end'
          }}
        >
          {status === 'pass' && (
            <Button onClick={handleSuccess} color="green" filled>
              Success!
            </Button>
          )}
          {status === 'too short' && (
            <p style={{ fontSize: '1.5rem', color: Color.red() }}>
              {`You shouldn't be typing! Copy and paste the text above`}
            </p>
          )}
          {status === 'too long' && (
            <p style={{ fontSize: '1.5rem', color: Color.red() }}>
              You should copy and paste the text above!
            </p>
          )}
        </div>
      )}
    </div>
  );

  async function handleSuccess() {
    const { success, newXpAndRank, newCoins } = await uploadMissionAttempt({
      missionId: mission.id,
      attempt: { content, status: 'pass' }
    });
    if (success) {
      onUpdateMissionAttempt({
        missionId: mission.id,
        newState: { status: 'pass', tryingAgain: false }
      });
      if (newXpAndRank.xp) {
        onChangeUserXP({
          xp: newXpAndRank.xp,
          rank: newXpAndRank.rank,
          userId
        });
      }
      if (newCoins.netCoins) {
        onUpdateUserCoins({ coins: newCoins.netCoins, userId });
      }
    }
  }
}
