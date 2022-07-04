import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import Button from 'components/Button';
import request from 'axios';
import Message from './Message';
import Loading from 'components/Loading';
import LoadMoreButton from 'components/Buttons/LoadMoreButton';
import { GENERAL_CHAT_ID } from 'constants/defaultValues';
import { Color, Theme } from 'constants/css';
import { useMyState } from 'helpers/hooks';
import { queryStringForArray } from 'helpers/stringHelpers';
import URL from 'constants/URL';

const API_URL = `${URL}/chat`;

SubjectMsgsModal.propTypes = {
  channelId: PropTypes.number,
  onHide: PropTypes.func,
  subjectId: PropTypes.number,
  subjectTitle: PropTypes.string,
  theme: PropTypes.string
};

export default function SubjectMsgsModal({
  channelId,
  onHide,
  subjectId,
  subjectTitle,
  theme
}) {
  const { profileTheme } = useMyState();
  const defaultTopicColor = useMemo(
    () =>
      Color[
        theme ||
          (channelId === GENERAL_CHAT_ID
            ? Theme(profileTheme).subject.color
            : 'green')
      ](),
    [channelId, profileTheme, theme]
  );
  const [loading, setLoading] = useState(false);
  const [loadMoreButtonShown, setLoadMoreButtonShown] = useState(false);
  const [messages, setMessages] = useState([]);
  const [usermenuShown, setUsermenuShown] = useState(false);
  useEffect(() => {
    handleLoadMessages();
    async function handleLoadMessages() {
      try {
        const {
          data: { messages, loadMoreButtonShown }
        } = await request.get(
          `${API_URL}/chatSubject/messages?subjectId=${subjectId}`
        );
        setMessages(messages);
        setLoadMoreButtonShown(loadMoreButtonShown);
      } catch (error) {
        console.error(error.response || error);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Modal
      modalOverModal
      closeWhenClickedOutside={!usermenuShown}
      onHide={onHide}
    >
      <header>
        <span style={{ color: defaultTopicColor }}>{subjectTitle}</span>
      </header>
      <main>
        {loadMoreButtonShown && (
          <LoadMoreButton
            color="lightBlue"
            filled
            onClick={onLoadMoreButtonClick}
            loading={loading}
          />
        )}
        {messages.length === 0 && <Loading />}
        {messages.map((message) => (
          <Message
            key={message.id}
            defaultTopicColor={defaultTopicColor}
            onUsermenuShownChange={setUsermenuShown}
            {...message}
          />
        ))}
      </main>
      <footer>
        <Button transparent onClick={onHide}>
          Close
        </Button>
      </footer>
    </Modal>
  );

  async function onLoadMoreButtonClick() {
    setLoading(true);
    const queryString = queryStringForArray({
      array: messages,
      originVar: 'id',
      destinationVar: 'messageIds'
    });
    try {
      const {
        data: { messages: loadedMsgs, loadMoreButtonShown }
      } = await request.get(
        `${API_URL}/chatSubject/messages/more?subjectId=${subjectId}&${queryString}`
      );
      setLoading(false);
      setMessages(loadedMsgs.concat(messages));
      setLoadMoreButtonShown(loadMoreButtonShown);
    } catch (error) {
      console.error(error.response || error);
    }
  }
}
