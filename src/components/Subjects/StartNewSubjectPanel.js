import React from 'react';
import PropTypes from 'prop-types';
import SubjectInputForm from './SubjectInputForm';
import Button from 'components/Button';
import Icon from 'components/Icon';
import { charLimit } from 'constants/defaultValues';
import { useAppContext, useContentContext } from 'contexts';
import { useContentState, useMyState } from 'helpers/hooks';
import { css } from 'emotion';
import { Color, mobileMaxWidth } from 'constants/css';

StartNewSubjectPanel.propTypes = {
  onUploadSubject: PropTypes.func.isRequired,
  contentId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
  contentType: PropTypes.string.isRequired
};

export default function StartNewSubjectPanel({
  contentId,
  contentType,
  onUploadSubject
}) {
  const {
    requestHelpers: { uploadSubject }
  } = useAppContext();
  const { canEditRewardLevel } = useMyState();
  const {
    actions: { onSetSubjectFormShown }
  } = useContentContext();
  const { subjectFormShown } = useContentState({ contentType, contentId });
  return (
    <div
      className={css`
        background: #fff;
        border: 1px solid ${Color.borderGray()};
        font-size: 1.5rem;
        margin-top: 1rem;
        @media (max-width: ${mobileMaxWidth}) {
          border-left: 0;
          border-right: 0;
        }
      `}
    >
      <div style={{ padding: '1rem' }}>
        {subjectFormShown ? (
          <div>
            <SubjectInputForm
              contentId={contentId}
              contentType={contentType}
              canEditRewardLevel={canEditRewardLevel}
              isSubject
              autoFocus
              onSubmit={handleSubmit}
              onClose={() =>
                onSetSubjectFormShown({
                  contentId,
                  contentType,
                  shown: false
                })
              }
              rows={4}
              titleMaxChar={charLimit.subject.title}
              descriptionMaxChar={charLimit.subject.description}
              titlePlaceholder="Enter Subject..."
              descriptionPlaceholder="Enter Details... (Optional)"
            />
          </div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              skeuomorphic
              color="black"
              style={{ fontSize: '2rem' }}
              onClick={() =>
                onSetSubjectFormShown({ contentId, contentType, shown: true })
              }
            >
              <Icon icon="comment-alt" />
              <span style={{ marginLeft: '1rem' }}>Start a New Subject</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  async function handleSubmit({
    title,
    description,
    rewardLevel,
    secretAnswer
  }) {
    const data = await uploadSubject({
      title,
      description,
      contentId,
      rewardLevel,
      secretAnswer,
      contentType
    });
    onSetSubjectFormShown({ contentId, contentType, shown: false });
    onUploadSubject({ ...data, contentType, contentId });
  }
}
