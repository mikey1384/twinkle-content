import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Input from 'components/Texts/Input';
import { Color } from 'constants/css';

LaunchTheWebsite.propTypes = {
  style: PropTypes.object
};

export default function LaunchTheWebsite({ style }) {
  const mounted = useRef(true);
  const [url, setUrl] = useState('');
  const [hasUrlError] = useState(false);

  useEffect(() => {
    mounted.current = true;
    return function onDismount() {
      mounted.current = false;
    };
  }, []);

  return (
    <div style={style}>
      <Input
        autoFocus
        value={url}
        onChange={setUrl}
        style={{ marginTop: '3rem' }}
        placeholder="Paste the text here..."
      />
      {hasUrlError && (
        <p style={{ fontSize: '1.5rem', color: Color.red() }}>
          {`You shouldn't be typing! Copy and paste the text above`}
        </p>
      )}
    </div>
  );
}
