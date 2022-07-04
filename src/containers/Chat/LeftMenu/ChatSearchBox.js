import React, { memo, useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import Loading from 'components/Loading';
import SearchInput from 'components/Texts/SearchInput';
import { useMyState, useSearch } from 'helpers/hooks';
import { useAppContext, useChatContext } from 'contexts';
import { Color, Theme } from 'constants/css';
import { useNavigate } from 'react-router-dom';

ChatSearchBox.propTypes = {
  style: PropTypes.object
};

function ChatSearchBox({ style }) {
  const navigate = useNavigate();
  const searchChat = useAppContext((v) => v.requestHelpers.searchChat);
  const { profilePicUrl, profileTheme, userId, username, authLevel } =
    useMyState();
  const chatSearchResults = useChatContext((v) => v.state.chatSearchResults);
  const selectedChannelId = useChatContext((v) => v.state.selectedChannelId);
  const onClearChatSearchResults = useChatContext(
    (v) => v.actions.onClearChatSearchResults
  );
  const onOpenNewChatTab = useChatContext((v) => v.actions.onOpenNewChatTab);
  const onSearchChat = useChatContext((v) => v.actions.onSearchChat);

  const [searchText, setSearchText] = useState('');
  const handleSearchChat = useCallback(async (text) => {
    const data = await searchChat(text);
    onSearchChat(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const { handleSearch, searching } = useSearch({
    onSearch: handleSearchChat,
    onClear: onClearChatSearchResults,
    onSetSearchText: setSearchText
  });
  const handleSelect = useCallback(
    async (item) => {
      if (item.primary || !!item.pathId) {
        navigate(`/chat/${item.pathId}`);
      } else {
        onOpenNewChatTab({
          user: { username, id: userId, profilePicUrl, authLevel },
          recepient: {
            username: item.label,
            id: item.id,
            profilePicUrl: item.profilePicUrl,
            authLevel: item.authLevel
          }
        });
        setTimeout(() => navigate(`/chat/new`), 0);
      }
      setSearchText('');
      onClearChatSearchResults();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [authLevel, profilePicUrl, selectedChannelId, userId, username]
  );
  const generalChatColor = useMemo(
    () => Color[Theme(profileTheme).generalChat.color](),
    [profileTheme]
  );

  return (
    <div style={style}>
      <SearchInput
        placeholder="Search..."
        onChange={handleSearch}
        value={searchText}
        searchResults={chatSearchResults}
        renderItemLabel={(item) =>
          !item.primary || (item.primary && item.twoPeople) ? (
            <span>
              {item.label}{' '}
              {item.subLabel && <small>{`(${item.subLabel})`}</small>}
            </span>
          ) : (
            <span
              style={{
                color:
                  item.channelId === 2 ? generalChatColor : Color.logoBlue(),
                fontWeight: 'bold'
              }}
            >
              {item.label}
            </span>
          )
        }
        onClickOutSide={() => {
          setSearchText('');
          onClearChatSearchResults();
        }}
        onSelect={handleSelect}
      />
      {searching && (
        <Loading style={{ height: '7rem', position: 'absolute' }} />
      )}
    </div>
  );
}

export default memo(ChatSearchBox);
