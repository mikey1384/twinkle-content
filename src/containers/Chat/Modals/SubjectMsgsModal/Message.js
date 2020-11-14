import React from 'react';
import PropTypes from 'prop-types';
import ProfilePic from 'components/ProfilePic';
import UsernameText from 'components/Texts/UsernameText';
import ContentFileViewer from 'components/ContentFileViewer';
import LongText from 'components/Texts/LongText';
import { MessageStyle } from '../../Styles';
import { Color } from 'constants/css';
import { unix } from 'moment';

Message.propTypes = {
  id: PropTypes.number,
  content: PropTypes.string,
  fileName: PropTypes.string,
  filePath: PropTypes.string,
  fileSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isReloadedSubject: PropTypes.number,
  profilePicUrl: PropTypes.string,
  timeStamp: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  thumbUrl: PropTypes.string,
  userId: PropTypes.number,
  username: PropTypes.string
};

export default function Message({
  content,
  id: messageId,
  fileName,
  filePath,
  fileSize,
  userId,
  username,
  profilePicUrl,
  thumbUrl,
  timeStamp,
  isReloadedSubject
}) {
  return (
    <div className={MessageStyle.container}>
      <ProfilePic
        className={MessageStyle.profilePic}
        userId={userId}
        profilePicUrl={profilePicUrl}
      />
      <div className={MessageStyle.contentWrapper}>
        <div>
          <UsernameText
            style={MessageStyle.usernameText}
            user={{
              id: userId,
              username: username
            }}
          />{' '}
          <span className={MessageStyle.timeStamp}>
            {unix(timeStamp).format('LLL')}
          </span>
        </div>
        {filePath && (
          <ContentFileViewer
            modalOverModal
            contentId={messageId}
            contentType="chat"
            content={content}
            filePath={filePath}
            fileName={fileName}
            fileSize={fileSize}
            thumbUrl={thumbUrl}
            style={{ marginTop: '1rem' }}
          />
        )}
        <div>
          <div className={MessageStyle.messageWrapper}>
            <LongText
              style={{
                color: isReloadedSubject && Color.green(),
                fontWeight: isReloadedSubject && 'bold'
              }}
            >
              {isReloadedSubject ? 'Brought back the subject' : content}
            </LongText>
          </div>
        </div>
      </div>
    </div>
  );
}
