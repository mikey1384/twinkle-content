import React, { useState } from 'react';
import Input from 'components/Texts/Input';
import { Color } from 'constants/css';

export default function WebsiteVerifier() {
  const [url, setUrl] = useState('');
  const [hasUrlError] = useState(false);
  return (
    <div>
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
    </div>
  );
}
