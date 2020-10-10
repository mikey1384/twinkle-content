import React from 'react';
import PropTypes from 'prop-types';
import FileViewer from 'components/FileViewer';
import UsernameText from 'components/Texts/UsernameText';
import ApproveInterface from './ApproveInterface';
import { Color } from 'constants/css';
import { panel } from '../../Styles';
import { timeSince } from 'helpers/timeStampHelpers';

Attempt.propTypes = {
  attempt: PropTypes.object.isRequired,
  style: PropTypes.object
};

export default function Attempt({ attempt, style }) {
  return (
    <div
      style={{ width: '100%', paddingBottom: '1.5rem', ...style }}
      className={panel}
    >
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <UsernameText
          style={{ fontSize: '2rem' }}
          color={Color.blue()}
          user={attempt.uploader}
        />
        <div style={{ fontSize: '1.5rem', color: Color.darkGray() }}>
          {timeSince(attempt.uploadTimeStamp)}
        </div>
      </div>
      <FileViewer
        style={{ marginTop: '2rem' }}
        thumbUrl={attempt.thumbUrl}
        src={attempt.filePath}
      />
      <ApproveInterface attempt={attempt} />
    </div>
  );
}
