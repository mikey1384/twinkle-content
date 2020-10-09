import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import FileViewer from 'components/FileViewer';
import UsernameText from 'components/Texts/UsernameText';
import Button from 'components/Button';
import Icon from 'components/Icon';
import Textarea from 'components/Texts/Textarea';
import { Color } from 'constants/css';
import { panel } from '../Styles';
import { timeSince } from 'helpers/timeStampHelpers';
import { useInputContext } from 'contexts';
import { addEmoji, exceedsCharLimit } from 'helpers/stringHelpers';

Attempt.propTypes = {
  attempt: PropTypes.object.isRequired,
  mission: PropTypes.object.isRequired,
  missionId: PropTypes.number.isRequired,
  onSetMissionState: PropTypes.func.isRequired,
  style: PropTypes.object
};

export default function Attempt({
  attempt,
  mission,
  missionId,
  onSetMissionState,
  style
}) {
  const mounted = useRef(true);
  const defaultInputState = {
    feedback: '',
    status: ''
  };
  const {
    state,
    actions: { onSetMissionFeedbackForm }
  } = useInputContext();
  const inputState = useMemo(
    () => state[`mission-feedback-${attempt.id}`] || defaultInputState,
    [attempt.id, defaultInputState, state]
  );

  const statusRef = useRef(inputState.status || '');
  const [status, setStatus] = useState(inputState.status || '');
  const feedbackRef = useRef(inputState.feedback || '');
  const [feedback, setFeedback] = useState(inputState.feedback || '');

  const feedbackExceedsCharLimit = useMemo(
    () =>
      exceedsCharLimit({
        contentType: 'rewardComment',
        text: feedback
      }),
    [feedback]
  );

  useEffect(() => {
    mounted.current = true;
    console.log(mission, missionId, onSetMissionState);
    return function cleanUp() {
      onSetMissionFeedbackForm({
        attemptId: attempt.id,
        form: {
          feedback: feedbackRef.current,
          status: statusRef.current
        }
      });
      mounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      style={{ width: '100%', paddingBottom: '2rem', ...style }}
      className={panel}
    >
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <UsernameText
          style={{ fontSize: '2rem' }}
          color={Color.blue()}
          user={attempt.uploader}
        />
        <div style={{ fontSize: '1.5rem', color: Color.darkGray() }}>
          {timeSince(attempt.uploadTimeStamp)}
        </div>
      </div>
      <FileViewer
        style={{ marginTop: '2rem' }}
        thumbUrl={attempt.thumbUrl}
        src={attempt.filePath}
      />
      <Textarea
        minRows={3}
        value={feedback}
        onChange={(event) => {
          handleSetFeedback(addEmoji(event.target.value));
        }}
        placeholder={`Explain why you are approving/rejecting this mission attempt...`}
        style={feedbackExceedsCharLimit?.style}
      />
      <div
        style={{
          marginTop: '5rem',
          width: '100%',
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <Button
          filled={status === 'rejected'}
          onClick={() => handleSetStatus('rejected')}
          color="rose"
          skeuomorphic
        >
          <Icon icon="thumbs-down" />
          <span style={{ marginLeft: '1rem' }}>Reject</span>
        </Button>
        <Button
          filled={status === 'approved'}
          onClick={() => handleSetStatus('approved')}
          color="darkBlue"
          style={{ marginLeft: '1rem' }}
          skeuomorphic
        >
          <Icon icon="thumbs-up" />
          <span style={{ marginLeft: '1rem' }}>Approve</span>
        </Button>
      </div>
    </div>
  );

  function handleSetFeedback(text) {
    setFeedback(text);
    feedbackRef.current = text;
  }

  function handleSetStatus(status) {
    setStatus(status);
    statusRef.current = status;
  }
}
