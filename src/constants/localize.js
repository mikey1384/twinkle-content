const selectedLanguage = process.env.REACT_APP_SELECTED_LANGUAGE;
const languageObj = {
  home: {
    en: 'Home',
    kr: '홈'
  },
  explore: {
    en: 'Explore',
    kr: '탐색'
  },
  missions: {
    en: 'Missions',
    kr: '미션'
  },
  chat: {
    en: 'Chat',
    kr: '채팅'
  }
};
export default function localize(section) {
  return languageObj[section][selectedLanguage];
}
