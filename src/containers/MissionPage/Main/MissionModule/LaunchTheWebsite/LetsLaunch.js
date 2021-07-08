import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Input from 'components/Texts/Input';
import StepSlide from '../components/StepSlide';
import { Color } from 'constants/css';

LetsLaunch.propTypes = {
  index: PropTypes.number
};

export default function LetsLaunch({ index }) {
  const [url, setUrl] = useState('');
  const [hasUrlError] = useState(false);
  return (
    <StepSlide
      title={
        <>
          Launch your website by importing your {`website's`} GitHub repository
          to Vercel.
          <br />
          When you are done, copy the {`website's`} url address and paste it
          into the text box below.
        </>
      }
      index={index}
    >
      <Input
        autoFocus
        value={url}
        onChange={setUrl}
        style={{ marginTop: '3rem' }}
        placeholder="Paste the text here..."
      />
      {hasUrlError && (
        <p style={{ fontSize: '1.5rem', color: Color.red() }}>
          {`That is not a valid vercel URL`}
        </p>
      )}
    </StepSlide>
  );
}
