import React, { useContext, useState } from 'react';
import Button from 'components/Button';
import LocalContext from 'components/ContentPanel/Context';
import { useMyState } from 'helpers/hooks';
import ConfirmModal from 'components/Modals/ConfirmModal';
import PropTypes from 'prop-types';
import { useContentContext, useAppContext } from 'contexts';

ViewSecretAnswerButton.propTypes = {
  parent: PropTypes.object,
  subjectId: PropTypes.number
};

export default function ViewSecretAnswerButton({ parent, subjectId }) {
  const { userId, profileTheme } = useMyState();
  const [confirmModalShown, setConfirmModalShown] = useState(false);
  const {
    requestHelpers: { checkIfUserResponded, loadComments, uploadComment }
  } = useAppContext();
  const {
    actions: { onChangeSpoilerStatus }
  } = useContentContext();

  const { onCommentSubmit, onLoadComments, onSetCommentsShown } = useContext(
    LocalContext
  );

  return (
    <>
      <Button
        color={profileTheme}
        filled
        onClick={() => {
          setConfirmModalShown(userId != null);
        }}
      >
        View Secret Answer
      </Button>
      {confirmModalShown && (
        <ConfirmModal
          title="View Secret Answer"
          description="Are you sure? If you confirm, you wouldn't get rewarded."
          descriptionFontSize="2.1rem"
          onHide={() => {
            setConfirmModalShown(false);
          }}
          onConfirm={handleConfirm}
        />
      )}
    </>
  );

  async function handleConfirm() {
    setConfirmModalShown(false);

    const { responded } = await checkIfUserResponded(subjectId);
    let data = {};
    if (!responded) {
      data = await uploadComment({
        content: 'viewed the answer',
        parent,
        subjectId,
        isSystemMessage: true
      });
    }

    onCommentSubmit({
      ...data,
      contentType: 'subject',
      contentId: subjectId
    });
    await handleExpandComments();
    onChangeSpoilerStatus({ shown: true, subjectId });
  }

  async function handleExpandComments() {
    const data = await loadComments({
      contentType: 'subject',
      contentId: subjectId,
      limit: 10
    });
    onLoadComments({ ...data, contentId: subjectId, contentType: 'subject' });
    onSetCommentsShown({ contentId: subjectId, contentType: 'subject' });
  }
}
