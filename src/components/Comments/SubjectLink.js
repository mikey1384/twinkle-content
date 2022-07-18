import React from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import { Link } from 'react-router-dom';
import { Color, Theme } from 'constants/css';
import { useKeyContext } from 'contexts';

SubjectLink.propTypes = {
  subject: PropTypes.object.isRequired,
  theme: PropTypes.string
};

export default function SubjectLink({ subject, theme }) {
  const { profileTheme } = useKeyContext((v) => v.myState);
  const {
    content: { color: contentColor }
  } = Theme(theme || profileTheme);

  return (
    <ErrorBoundary componentPath="Comments/SubjectLink">
      <Link
        style={{
          fontWeight: 'bold',
          color: Color[contentColor]()
        }}
        to={`/subjects/${subject.id}`}
      >
        {subject.title}
      </Link>
    </ErrorBoundary>
  );
}
