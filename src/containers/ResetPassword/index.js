import React from 'react';
import Content from './Content';
import { Routes, Route, useMatch } from 'react-router-dom';
import InvalidPage from 'components/InvalidPage';

export default function ResetPassword() {
  const match = useMatch();
  return (
    <Routes>
      <Route path={`${match.path}/password/:token`} element={<Content />} />
      <Route element={<InvalidPage />} />
    </Routes>
  );
}
