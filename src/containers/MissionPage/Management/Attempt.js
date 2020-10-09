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
import { useAppContext, useInputContext } from 'contexts';
import { addEmoji, exceedsCharLimit } from 'helpers/stringHelpers';

Attempt.propTypes = {
  attempt: PropTypes.object.isRequired,
  style: PropTypes.object
};

export default function Attempt({ attempt, style }) {
  const {
    requestHelpers: { uploadMissionFeedback }
  } = useAppContext();
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
      style={{ width: '100%', paddingBottom: '1.5rem', ...style }}
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
      <div style={{ marginTop: '2rem' }}>
        <div
          style={{
            marginTop: '2rem',
            width: '100%',
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          <Button
            filled={status === 'rejected'}
            onClick={() => handleSetStatus('rejected')}
            color="rose"
          >
            <Icon icon="thumbs-down" />
            <span style={{ marginLeft: '1rem' }}>Reject</span>
          </Button>
          <Button
            filled={status === 'approved'}
            onClick={() => handleSetStatus('approved')}
            color="logoBlue"
            style={{ marginLeft: '1rem' }}
          >
            <Icon icon="thumbs-up" />
            <span style={{ marginLeft: '1rem' }}>Approve</span>
          </Button>
        </div>
        {status && (
          <div
            style={{ display: 'flex', flexDirection: 'column', width: '100%' }}
          >
            <div style={{ fontWeight: 'bold', fontSize: '2rem' }}>
              Feedback:
            </div>
            <Textarea
              minRows={3}
              value={feedback}
              onChange={(event) => {
                handleSetFeedback(addEmoji(event.target.value));
              }}
              placeholder={`Explain why you are approving/rejecting this mission attempt...`}
              style={{ marginTop: '1rem', ...feedbackExceedsCharLimit?.style }}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                width: '100%'
              }}
            >
              <Button
                style={{ marginTop: '1.5rem', fontSize: '2rem' }}
                color={status === 'approved' ? 'logoBlue' : 'rose'}
                filled
                onClick={handleConfirm}
              >
                <Icon
                  icon={status === 'approved' ? 'thumbs-up' : 'thumbs-down'}
                />
                <span style={{ marginLeft: '1rem' }}>
                  confirm {status === 'approved' ? 'approval' : 'rejection'}
                </span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  async function handleConfirm() {
    const data = await uploadMissionFeedback({
      attemptId: attempt.id,
      feedback,
      status
    });
    console.log(data);
  }

  function handleSetFeedback(text) {
    setFeedback(text);
    feedbackRef.current = text;
  }

  function handleSetStatus(status) {
    setStatus(status);
    statusRef.current = status;
  }
}
