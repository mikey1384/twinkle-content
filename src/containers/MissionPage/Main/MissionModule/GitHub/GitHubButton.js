import React from 'react';
import { GITHUB_APP_ID } from 'constants/defaultValues';
import Button from 'components/Button';

export default function GitHubButton() {
  return (
    <Button filled color="logoBlue" onClick={handleGitHubButtonClick}>
      GitHub Button!!
    </Button>
  );

  function handleGitHubButtonClick() {
    window.location = `https://github.com/login/oauth/authorize?scope=user&client_id=${GITHUB_APP_ID}`;
  }
}
