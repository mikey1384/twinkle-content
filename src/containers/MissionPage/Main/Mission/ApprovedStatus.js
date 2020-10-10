import React from 'react';
import PropTypes from 'prop-types';
import FileViewer from 'components/FileViewer';
import UsernameText from 'components/Texts/UsernameText';
import { borderRadius, Color } from 'constants/css';
import { timeSince } from 'helpers/timeStampHelpers';
import { stringIsEmpty } from 'helpers/stringHelpers';

ApprovedStatus.propTypes = {
  myAttempt: PropTypes.object.isRequired,
  style: PropTypes.object
};

export default function ApprovedStatus({ myAttempt, style }) {
  return (
    <div
      style={{
        width: '100%',
        fontSize: '1.7rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        lineHeight: 2,
        ...style
      }}
    >
      <div
        style={{ fontWeight: 'bold', fontSize: '2rem', color: Color.green() }}
      >
        Mission Accomplished!
      </div>
      {myAttempt.filePath && (
        <FileViewer
          style={{ marginTop: '1.5rem' }}
          thumbUrl={myAttempt.thumbUrl}
          src={myAttempt.filePath}
        />
      )}
      {!stringIsEmpty(myAttempt.feedback) && (
        <div
          style={{
            width: '100%',
            marginTop: '3rem',
            padding: '1rem',
            border: `1px solid ${Color.borderGray()}`,
            borderRadius
          }}
        >
          {myAttempt.reviewer && (
            <>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  lineHeight: 1.5
                }}
              >
                <UsernameText color={Color.blue()} user={myAttempt.reviewer} />
                <span>{timeSince(myAttempt.reviewTimeStamp)}</span>
              </div>
              <div>{myAttempt.feedback || 'Great job!'}</div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
