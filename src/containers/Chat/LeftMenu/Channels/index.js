import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import Channel from './Channel';
import LoadMoreButton from 'components/Buttons/LoadMoreButton';
import ErrorBoundary from 'components/ErrorBoundary';
import { useAppContext, useChatContext } from 'contexts';
import { addEvent, removeEvent } from 'helpers/listenerHelpers';

function Channels() {
  const loadMoreChannels = useAppContext(
    (v) => v.requestHelpers.loadMoreChannels
  );
  const {
    state: {
      chatType,
      channelsObj,
      classChannelIds,
      customChannelNames,
      favoriteChannelIds,
      homeChannelIds,
      classLoadMoreButton,
      favoriteLoadMoreButton,
      homeLoadMoreButton,
      selectedChannelId,
      selectedChatTab
    },
    actions: { onLoadMoreChannels }
  } = useChatContext();
  const [channelsLoading, setChannelsLoading] = useState(false);
  const [prevChannelIds, setPrevChannelIds] = useState(homeChannelIds);
  const ChannelListRef = useRef(null);
  const timeoutRef = useRef(null);
  const selectedChatTabRef = useRef('home');
  const loading = useRef(false);
  const channelIds = useMemo(() => {
    switch (selectedChatTab) {
      case 'home':
        return homeChannelIds;
      case 'favorite':
        return favoriteChannelIds;
      case 'class':
        return classChannelIds;
      default:
        return [];
    }
  }, [classChannelIds, favoriteChannelIds, homeChannelIds, selectedChatTab]);

  const loadMoreButtonShown = useMemo(() => {
    const hash = {
      home: homeLoadMoreButton,
      class: classLoadMoreButton,
      favorite: favoriteLoadMoreButton
    };
    return hash[selectedChatTab];
  }, [
    classLoadMoreButton,
    favoriteLoadMoreButton,
    homeLoadMoreButton,
    selectedChatTab
  ]);

  const handleLoadMoreChannels = useCallback(async () => {
    const chatTabHash = {
      home: homeChannelIds,
      favorite: favoriteChannelIds,
      class: classChannelIds
    };
    if (!loading.current) {
      loading.current = true;
      setChannelsLoading(true);
      const channelIds = chatTabHash[selectedChatTab];
      const lastId = channelIds[channelIds.length - 1];
      const { lastUpdated } = channelsObj[lastId];
      const channels = await loadMoreChannels({
        type: selectedChatTab,
        lastUpdated,
        lastId,
        currentChannelId: selectedChannelId
      });
      if (selectedChatTabRef.current === selectedChatTab) {
        setChannelsLoading(false);
        onLoadMoreChannels({ type: selectedChatTab, channels });
      }
      loading.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    channelsObj,
    classChannelIds,
    favoriteChannelIds,
    homeChannelIds,
    selectedChannelId,
    selectedChatTab
  ]);

  useEffect(() => {
    const ChannelList = ChannelListRef.current;
    addEvent(ChannelList, 'scroll', onListScroll);

    function onListScroll() {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        if (
          loadMoreButtonShown &&
          ChannelListRef.current.scrollTop >=
            (ChannelListRef.current.scrollHeight -
              ChannelListRef.current.offsetHeight) *
              0.7
        ) {
          handleLoadMoreChannels();
        }
      }, 250);
    }

    return function cleanUp() {
      removeEvent(ChannelList, 'scroll', onListScroll);
    };
  });

  useEffect(() => {
    clearTimeout(timeoutRef.current);
    loading.current = false;
    setChannelsLoading(false);
    selectedChatTabRef.current = selectedChatTab;
    ChannelListRef.current.scrollTop = 0;
  }, [selectedChatTab]);

  useEffect(() => {
    if (
      selectedChannelId === homeChannelIds[0] &&
      homeChannelIds[0] !== prevChannelIds[0]
    ) {
      ChannelListRef.current.scrollTop = 0;
    }
    setPrevChannelIds(homeChannelIds);
  }, [homeChannelIds, selectedChannelId, prevChannelIds]);

  return (
    <ErrorBoundary
      innerRef={ChannelListRef}
      style={{
        overflow: 'scroll',
        top: '17.5rem',
        width: '80%',
        height: '100%'
      }}
    >
      {channelIds
        ?.map((channelId) => channelsObj[channelId])
        .filter((channel) => !channel?.isHidden)
        .map((channel) => (
          <Channel
            key={selectedChatTab + channel.id}
            channel={channel}
            customChannelNames={customChannelNames}
            chatType={chatType}
            selectedChannelId={selectedChannelId}
          />
        ))}
      {loadMoreButtonShown && (
        <LoadMoreButton
          color="green"
          filled
          loading={channelsLoading}
          onClick={handleLoadMoreChannels}
          style={{
            width: '100%',
            borderRadius: 0,
            border: 0
          }}
        />
      )}
    </ErrorBoundary>
  );
}

export default memo(Channels);
