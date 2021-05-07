import React from 'react';
import ErrorBoundary from 'components/ErrorBoundary';
import Button from 'components/Button';

export default function GitHub() {
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
    console.log('this button has been clicked');
  }
}
