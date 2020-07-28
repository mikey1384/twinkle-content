export function determineSelectedChatTab({
  currentChatType,
  currentSelectedChatTab,
  selectedChatTab,
  selectedChannel
}) {
  let newSelectedChatTab = currentSelectedChatTab;
  if (selectedChatTab) {
    newSelectedChatTab = selectedChatTab;
  } else if (currentSelectedChatTab === 'class' && !selectedChannel?.isClass) {
    newSelectedChatTab = 'home';
  }
  return {
    selectedChatTab: newSelectedChatTab,
    chatType:
      selectedChatTab !== 'home' || selectedChannel ? null : currentChatType
  };
}
