import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import ErrorBoundary from 'components/ErrorBoundary';
import Button from 'components/Button';
import queryString from 'query-string';
import { GITHUB_APP_ID } from 'constants/defaultValues';

export default function GitHub() {
  const location = useLocation();
  const { search } = location;
  const { code } = useMemo(() => queryString.parse(search), [search]);
  console.log(code);

  return (
    <ErrorBoundary style={{ width: '100%' }}>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <Button filled color="logoBlue" onClick={handleGitHubButtonClick}>
          GitHub Button
        </Button>
      </div>
    </ErrorBoundary>
  );

  async function handleGitHubButtonClick() {
    window.location = `https://github.com/login/oauth/authorize?scope=user&client_id=${GITHUB_APP_ID}`;
  }
}
