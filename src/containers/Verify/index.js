import React from 'react';
import { Routes, Route, useMatch } from 'react-router-dom';
import InvalidPage from 'components/InvalidPage';
import Email from './Email';

export default function Verify() {
  const match = useMatch();
  return (
    <Routes>
      <Route path={`${match.path}/email/:token`} element={<Email />} />
      <Route element={<InvalidPage />} />
    </Routes>
  );
}
