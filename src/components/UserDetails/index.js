import React, { useMemo, useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Link from 'components/Link';
import StatusInput from './StatusInput';
import Button from 'components/Button';
import Icon from 'components/Icon';
import ConfirmModal from 'components/Modals/ConfirmModal';
import request from 'axios';
import ErrorBoundary from 'components/ErrorBoundary';
import StatusMsg from './StatusMsg';
import Bio from 'components/Texts/Bio';
import { css } from '@emotion/css';
import { Color } from 'constants/css';
import { useTheme } from 'helpers/hooks';
import { addEmoji, finalizeEmoji, renderText } from 'helpers/stringHelpers';
import URL from 'constants/URL';
import {
  useAppContext,
  useContentContext,
  useInputContext,
  useProfileContext
} from 'contexts';
import localize from 'constants/localize';

const doesNotHaveBioLabel = localize('doesNotHaveBio');

UserDetails.propTypes = {
  noLink: PropTypes.bool,
  onSetBioEditModalShown: PropTypes.func,
  profile: PropTypes.object.isRequired,
  removeStatusMsg: PropTypes.func,
  style: PropTypes.object,
  unEditable: PropTypes.bool,
  updateStatusMsg: PropTypes.func,
  userId: PropTypes.number,
  small: PropTypes.bool
};

export default function UserDetails({
  noLink,
  profile,
  removeStatusMsg,
  small,
  style = {},
  onSetBioEditModalShown,
  unEditable,
  updateStatusMsg,
  userId
}) {
  const auth = useAppContext((v) => v.requestHelpers.auth);
  const onReloadContent = useContentContext((v) => v.actions.onReloadContent);
  const editedStatusColor = useInputContext((v) => v.state.editedStatusColor);
  const editedStatusMsg = useInputContext((v) => v.state.editedStatusMsg);
  const onSetEditedStatusColor = useInputContext(
    (v) => v.actions.onSetEditedStatusColor
  );
  const onSetEditedStatusMsg = useInputContext(
    (v) => v.actions.onSetEditedStatusMsg
  );
  const onResetProfile = useProfileContext((v) => v.actions.onResetProfile);
  const [confirmModalShown, setConfirmModalShown] = useState(false);
  useEffect(() => {
    onSetEditedStatusColor('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);
  const StatusInputRef = useRef(null);
  const { profileFirstRow, profileSecondRow, profileThirdRow } = profile;
  const statusColor = useMemo(() => {
    return (
      (userId === profile.id
        ? editedStatusColor || profile.statusColor
        : profile.statusColor) || 'logoBlue'
    );
  }, [editedStatusColor, profile.id, profile.statusColor, userId]);
  const noProfile = useMemo(
    () => !profileFirstRow && !profileSecondRow && !profileThirdRow,
    [profileFirstRow, profileSecondRow, profileThirdRow]
  );
  const displayedStatusMsg = useMemo(
    () =>
      userId === profile.id && editedStatusMsg
        ? editedStatusMsg
        : profile.statusMsg,
    [editedStatusMsg, profile.id, profile.statusMsg, userId]
  );
  const {
    userLink: { color: userLinkColor }
  } = useTheme(profile.profileTheme || 'logoBlue');

  return (
    <ErrorBoundary
      componentPath="UserDetails/index"
      style={{
        display: 'flex',
        flexDirection: 'column',
        ...style
      }}
    >
      <Link
        to={noLink ? null : `/users/${profile.username}`}
        onClick={handleReloadProfile}
        style={{
          fontSize: small ? '3rem' : '3.5rem',
          fontWeight: 'bold',
          color: Color.darkerGray(),
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          lineHeight: 'normal',
          textDecoration: 'none'
        }}
        className={
          noLink
            ? ''
            : css`
                transition: color 0.2s;
                &:hover {
                  color: ${Color[userLinkColor]()}!important;
                }
              `
        }
      >
        {profile.username}
      </Link>
      <p
        style={{ fontSize: small ? '1.3rem' : '1.5rem', color: Color.gray() }}
      >{`(${profile.realName})`}</p>
      {userId === profile.id && !unEditable && (
        <StatusInput
          innerRef={StatusInputRef}
          profile={profile}
          statusColor={statusColor}
          editedStatusMsg={editedStatusMsg}
          setColor={onSetEditedStatusColor}
          onTextChange={(event) => {
            onSetEditedStatusMsg(addEmoji(renderText(event.target.value)));
            if (!event.target.value) {
              onSetEditedStatusColor('');
            }
          }}
          onCancel={() => {
            onSetEditedStatusMsg('');
            onSetEditedStatusColor('');
          }}
          onStatusSubmit={onStatusMsgSubmit}
        />
      )}
      {(profile.statusMsg || displayedStatusMsg) && (
        <StatusMsg statusColor={statusColor} statusMsg={displayedStatusMsg} />
      )}
      {profile.statusMsg &&
        !editedStatusMsg &&
        userId === profile.id &&
        !unEditable && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginTop: '0.5rem'
            }}
          >
            <Button
              transparent
              onClick={() => {
                onSetEditedStatusMsg(profile.statusMsg);
                StatusInputRef.current.focus();
              }}
            >
              <Icon icon="pencil-alt" />
              <span style={{ marginLeft: '0.7rem' }}>Change</span>
            </Button>
            <Button
              transparent
              style={{ marginLeft: '1rem' }}
              onClick={() => setConfirmModalShown(true)}
            >
              <Icon icon="trash-alt" />
              <span style={{ marginLeft: '0.7rem' }}>Remove</span>
            </Button>
          </div>
        )}
      {!noProfile && (
        <Bio
          small={small}
          firstRow={profileFirstRow}
          secondRow={profileSecondRow}
          thirdRow={profileThirdRow}
        />
      )}
      {noProfile &&
        (userId === profile.id && !unEditable ? (
          <div style={{ padding: '4rem 1rem 3rem 1rem' }}>
            <a
              style={{
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '2rem'
              }}
              onClick={() => onSetBioEditModalShown?.(true)}
            >
              Introduce yourself!
            </a>
          </div>
        ) : (
          <div
            style={{
              height: '6rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start'
            }}
          >
            <span>
              {profile.username}
              {doesNotHaveBioLabel}
            </span>
          </div>
        ))}
      {confirmModalShown && (
        <ConfirmModal
          onConfirm={onRemoveStatus}
          onHide={() => setConfirmModalShown(false)}
          title={`Remove Status Message`}
        />
      )}
    </ErrorBoundary>
  );

  function handleReloadProfile() {
    onReloadContent({
      contentId: profile.id,
      contentType: 'user'
    });
    onResetProfile(profile.username);
  }

  async function onRemoveStatus() {
    await request.delete(`${URL}/user/statusMsg`, auth());
    removeStatusMsg(profile.id);
    setConfirmModalShown(false);
  }

  async function onStatusMsgSubmit() {
    const statusMsg = finalizeEmoji(editedStatusMsg);
    const statusColor = editedStatusColor || profile.statusColor;
    const { data } = await request.post(
      `${URL}/user/statusMsg`,
      {
        statusMsg,
        statusColor
      },
      auth()
    );
    onSetEditedStatusColor('');
    onSetEditedStatusMsg('');
    if (typeof updateStatusMsg === 'function') updateStatusMsg(data);
  }
}
