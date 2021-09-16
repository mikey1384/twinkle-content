import React, { useEffect, useState, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import Input from 'components/Texts/Input';
import StepSlide from '../components/StepSlide';
import Button from 'components/Button';
import { Color, mobileMaxWidth } from 'constants/css';
import { css } from '@emotion/css';
import { stringIsEmpty, isValidUrl } from 'helpers/stringHelpers';
import { useAppContext, useMissionContext } from 'contexts';

LetsLaunch.propTypes = {
  index: PropTypes.number,
  innerRef: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  taskId: PropTypes.number.isRequired
};

export default function LetsLaunch({ index, innerRef, taskId }) {
  const {
    requestHelpers: { uploadMissionAttempt }
  } = useAppContext();
  const {
    actions: { onUpdateMissionAttempt }
  } = useMissionContext();
  const [url, setUrl] = useState('');
  const [urlError, setUrlError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const submittingRef = useRef(false);
  const timerRef = useRef(null);
  const urlErrorRef = useRef('');
  const urlIsNotEmpty = useMemo(() => !stringIsEmpty(url), [url]);
  const mounted = useRef(true);

  useEffect(() => {
    const notValidUrl = `That's not a valid url`;
    const notValidVercelUrl = `That's not a valid Vercel url`;
    if (urlIsNotEmpty) {
      clearTimeout(timerRef.current);
      if (url.length < 3) {
        setUrlError(`Please copy and paste the url. Don't type`);
        setUrl('');
        timerRef.current = setTimeout(() => setUrlError(''), 2000);
        return;
      }
      if (!isValidUrl(url) && !urlError) {
        urlErrorRef.current = notValidUrl;
        setUrlError(notValidUrl);
        setUrl('');
        timerRef.current = setTimeout(() => setUrlError(''), 3000);
        return;
      }
      if (!url.includes('vercel.app')) {
        urlErrorRef.current = notValidVercelUrl;
        setUrlError(notValidVercelUrl);
        setUrl('');
        timerRef.current = setTimeout(() => setUrlError(''), 3000);
        return;
      }
      return setUrlError('');
    }
  }, [url, urlError, urlIsNotEmpty]);

  useEffect(() => {
    mounted.current = true;
    return function onUnmount() {
      mounted.current = false;
    };
  }, []);

  return (
    <StepSlide
      title={
        <>
          Launch your website by importing your {`website's`} GitHub repository
          to Vercel.
          <br />
          When you are done, copy the {`website's`} url address generated by
          Vercel and paste it into the text box below.
          <br />
          (Read the <span style={{ color: Color.brownOrange() }}>
            tutorial
          </span>{' '}
          for step-by-step instructions)
        </>
      }
      innerRef={innerRef}
      index={index}
    >
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Input
          autoFocus
          value={url}
          onChange={setUrl}
          placeholder="Paste your website's vercel url here..."
          className={css`
            margin-top: 3rem;
            width: 50%;
            @media (max-width: ${mobileMaxWidth}) {
              margin-top: 1rem;
              width: 100%;
            }
          `}
        />
        {urlError && (
          <p
            style={{
              fontSize: '1.5rem',
              color: Color.red(),
              marginTop: '0.5rem'
            }}
          >
            {urlError}
          </p>
        )}
        {urlIsNotEmpty && !urlError && (
          <Button
            style={{ marginTop: '3rem' }}
            skeuomorphic
            color="green"
            disabled={submitting}
            onClick={handleSubmit}
          >
            Submit
          </Button>
        )}
      </div>
    </StepSlide>
  );

  async function handleSubmit() {
    if (!submittingRef.current) {
      submittingRef.current = true;
      setSubmitting(true);
      const { success } = await uploadMissionAttempt({
        missionId: taskId,
        attempt: {
          content: url
        }
      });
      if (success) {
        if (mounted.current) {
          onUpdateMissionAttempt({
            missionId: taskId,
            newState: { status: 'pending', tryingAgain: false }
          });
        }
      }
      submittingRef.current = false;
      if (mounted.current) {
        setSubmitting(false);
      }
    }
  }
}
