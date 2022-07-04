import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import { Link } from 'react-router-dom';
import { useMyState } from 'helpers/hooks';
import { Color, Theme } from 'constants/css';

SubjectLink.propTypes = {
  subject: PropTypes.object.isRequired
};

export default function SubjectLink({ subject }) {
  const { profileTheme } = useMyState();
  const subjectLinkColor = useMemo(
    () => Color[Theme(profileTheme).subject.color](),
    [profileTheme]
  );
  return (
    <ErrorBoundary componentPath="Comments/SubjectLink">
      <Link
        style={{
          fontWeight: 'bold',
          color: subjectLinkColor
        }}
        to={`/subjects/${subject.id}`}
      >
        {subject.title}
      </Link>
    </ErrorBoundary>
  );
}
