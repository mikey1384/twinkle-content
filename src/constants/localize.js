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
  },
  postSubject: {
    en: 'Post a subject users can talk about',
    kr: '사용자들이 대화할 수 있는 주제를 게시하세요'
  },
  postSubjectPlaceholder: {
    en: 'A subject users can talk about',
    kr: '무엇에 대해 이야기 나누고 싶으신가요?'
  },
  postContent: {
    en: 'Share interesting videos or webpages',
    kr: '흥미로운 동영상이나 웹페이지를 공유하세요'
  },
  copyAndPasteUrl: {
    en: 'Copy and paste a URL address here',
    kr: 'URL 주소를 복사한 후 여기에 붙여넣으세요'
  },
  youtubeVideo: {
    en: 'YouTube Video',
    kr: '유튜브 동영상'
  },
  allPosts: {
    en: 'All Posts',
    kr: '모든 게시물'
  },
  subjects: {
    en: 'Subjects',
    kr: '주제'
  }
};
export default function localize(section) {
  return languageObj[section][selectedLanguage];
}
