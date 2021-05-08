import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Color } from 'constants/css';
import { useAppContext, useContentContext } from 'contexts';
import { useMyState } from 'helpers/hooks';
import queryString from 'query-string';
import Button from 'components/Button';
import GitHubButton from './GitHubButton';
import ErrorBoundary from 'components/ErrorBoundary';
import Loading from 'components/Loading';

export default function GitHubVerifier() {
  const {
    requestHelpers: { loadGitHubData }
  } = useAppContext();
  const {
    actions: { onUpdateProfileInfo }
  } = useContentContext();
  const { userId } = useMyState();
  const location = useLocation();
  const { search } = location;
  const { code } = useMemo(() => queryString.parse(search), [search]);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [githubAccountMade, setGithubAccountMade] = useState(false);
  useEffect(() => {
    if (code) {
      initGitHubData();
    }
    async function initGitHubData() {
      try {
        setLoading(true);
        const githubUsername = await loadGitHubData(code);
        onUpdateProfileInfo({
          userId,
          githubUsername
        });
      } catch (error) {
        setErrorMsg('Failed to fetch your GitHub username - try again');
      }
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  return (
    <ErrorBoundary>
      <div>
        {loading && <Loading />}
        {!loading && (
          <>
            {!githubAccountMade && (
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'column'
                }}
              >
                <p
                  style={{
                    marginBottom: '3rem',
                    fontSize: '1.7rem',
                    fontWeight: 'bold'
                  }}
                >
                  1. Create a GitHub account from{' '}
                  <a
                    href="https://www.github.com"
                    target="_blank"
                    rel="noreferrer"
                  >
                    www.github.com
                  </a>
                </p>
                <Button
                  skeuomorphic
                  color="logoBlue"
                  onClick={() => setGithubAccountMade(true)}
                >
                  I created a github account
                </Button>
              </div>
            )}
            {githubAccountMade && (
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'column'
                }}
              >
                <p
                  style={{
                    marginBottom: '2rem',
                    fontSize: '1.7rem',
                    fontWeight: 'bold'
                  }}
                >
                  2. Tap the button below
                </p>
                <GitHubButton />
                <p
                  style={{
                    fontSize: '1.2rem',
                    marginTop: '0.5rem',
                    color: Color.red()
                  }}
                >
                  {errorMsg}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </ErrorBoundary>
  );
}
