import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Input from 'components/Texts/Input';
import { stringIsEmpty } from 'helpers/stringHelpers';

const missionText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce luctus
commodo purus eget tempus. In suscipit euismod ex, sit amet maximus sem
egestas ac. Duis libero massa, imperdiet a neque et, posuere aliquam
metus. Curabitur rhoncus semper augue, sit amet placerat libero mattis
eu. Donec id nulla venenatis, eleifend enim quis, placerat est. Nulla
facilisi. Nunc molestie dolor sed odio dignissim cursus et eu ligula.
Suspendisse feugiat iaculis turpis, id dictum massa finibus eu. Cras
tempus sagittis commodo. Nunc consectetur ut mi vel pharetra. Integer
posuere diam at nulla porttitor suscipit. Aliquam eget ligula non turpis
ultrices pulvinar in in mi. Sed fermentum libero sed nisl feugiat
rhoncus. Etiam fringilla porta feugiat. Donec et arcu venenatis, pretium
nulla ut, convallis odio.`.replace(/\n/gi, ' ');

CopyAndPaste.propTypes = {
  mission: PropTypes.object.isRequired,
  onSetMissionState: PropTypes.func.isRequired
};

export default function CopyAndPaste({ mission, onSetMissionState }) {
  const { content = '' } = mission;
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (!stringIsEmpty(content)) {
      setStatus(content.localeCompare(missionText) === 0 ? 'success' : 'fail');
    } else {
      setStatus('');
    }
  }, [content]);

  return (
    <div style={{ marginTop: '2.5rem' }}>
      <div>{missionText}</div>
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

      {status === 'success' && <div>success!</div>}
    </div>
  );
}
