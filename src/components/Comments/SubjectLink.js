import React from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import { Link } from 'react-router-dom';
import { useTheme } from 'helpers/hooks';
import { Color } from 'constants/css';

SubjectLink.propTypes = {
  subject: PropTypes.object.isRequired
};

export default function SubjectLink({ subject }) {
  const {
    subject: { color: subjectColor }
  } = useTheme();

  return (
    <ErrorBoundary componentPath="Comments/SubjectLink">
      <Link
        style={{
          fontWeight: 'bold',
          color: Color[subjectColor]()
        }}
        to={`/subjects/${subject.id}`}
      >
        {subject.title}
      </Link>
    </ErrorBoundary>
  );
}
