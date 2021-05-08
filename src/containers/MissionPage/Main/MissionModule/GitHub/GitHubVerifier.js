import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Color } from 'constants/css';
import { useAppContext } from 'contexts';
import queryString from 'query-string';
import GitHubButton from './GitHubButton';

export default function GitHubVerifier() {
  const {
    requestHelpers: { loadGitHubData }
  } = useAppContext();
  const location = useLocation();
  const { search } = location;
  const { code } = useMemo(() => queryString.parse(search), [search]);
  const [errorMsg, setErrorMsg] = useState('');
  useEffect(() => {
    if (code) {
      initGitHubData();
    }
    async function initGitHubData() {
      try {
        const githubUsername = await loadGitHubData(code);
        console.log(githubUsername);
      } catch (error) {
        setErrorMsg('Failed to fetch your GitHub username - try again');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  return (
    <div>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <GitHubButton />
      </div>
      {errorMsg && (
        <p
          style={{
            marginTop: '0.5rem',
            color: Color.red(),
            textAlign: 'center'
          }}
        >
          {errorMsg}
        </p>
      )}
    </div>
  );
}
