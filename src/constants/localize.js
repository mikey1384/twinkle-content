const selectedLanguage = process.env.REACT_APP_SELECTED_LANGUAGE;
const languageObj = {
  add: {
    en: 'Add',
    kr: '추가'
  },
  addQuestions: {
    en: 'Add Questions',
    kr: '문제 등록하기'
  },
  addEditQuestions: {
    en: 'Add/Edit Questions',
    kr: '문제 등록/수정하기'
  },
  allPosts: {
    en: 'All Posts',
    kr: '모든 게시물'
  },
  cancel: {
    en: 'Cancel',
    kr: '취소'
  },
  chat: {
    en: 'Chat',
    kr: '채팅'
  },
  choiceA: {
    en: 'Choice A',
    kr: '선택지 A'
  },
  choiceB: {
    en: 'Choice B',
    kr: '선택지 B'
  },
  choiceC: {
    en: 'Choice C (Optional)',
    kr: '선택지 C (선택사항)'
  },
  choiceD: {
    en: 'Choice D (Optional)',
    kr: '선택지 D (선택사항)'
  },
  choiceE: {
    en: 'Choice E (Optional)',
    kr: '선택지 E (선택사항)'
  },
  continue2: {
    en: 'Continue',
    kr: '이어서'
  },
  copyAndPasteUrl: {
    en: 'Copy and paste a URL address here',
    kr: 'URL 주소를 복사한 후 여기에 붙여넣으세요'
  },
  done: {
    en: 'Done',
    kr: '완료'
  },
  editQuestion: {
    en: 'Edit Question',
    kr: '문제 수정하기'
  },
  enterComment: {
    en: 'Enter Comment',
    kr: '댓글을 입력하세요'
  },
  enterDescription: {
    en: 'Enter Description',
    kr: '소개글을 입력하세요'
  },
  enterHeading: {
    en: 'Enter Heading',
    kr: '제목을 입력하세요'
  },
  enterQuestion: {
    en: 'Enter Question',
    kr: '문제를 입력하세요'
  },
  enterSecretMessage: {
    en: 'Enter Secret Message',
    kr: '비밀 메시지를 입력하세요'
  },
  enterSubject: {
    en: 'Enter Subject',
    kr: '주제를 입력하세요'
  },
  enterTitle: {
    en: 'Enter Title',
    kr: '제목을 입력하세요'
  },
  enterUrl: {
    en: 'Enter URL',
    kr: 'URL을 입력하세요'
  },
  enterYoutubeUrl: {
    en: 'Enter YouTube URL',
    kr: '유튜브 영상의 URL 주소를 입력하세요'
  },
  explore: {
    en: 'Explore',
    kr: '탐색'
  },
  hideWatched: {
    en: 'Hide Watched',
    kr: '시청한 영상 숨기기'
  },
  home: {
    en: 'Home',
    kr: '홈'
  },
  link: {
    en: 'Link',
    kr: '링크'
  },
  mission: {
    en: 'Mission',
    kr: '미션'
  },
  missions: {
    en: 'Missions',
    kr: '미션 목록'
  },
  newToOld: {
    en: 'New to Old',
    kr: '최신순'
  },
  oldToNew: {
    en: 'Old to New',
    kr: '오래된순'
  },
  optional: {
    en: '(Optional)',
    kr: '(선택사항)'
  },
  pleaseClickDoneButtonBelow: {
    en: 'Please click the "Done" button below',
    kr: '아래의 "완료" 버튼을 눌러주세요'
  },
  pleaseEnterTitle: {
    en: 'Please enter a title',
    kr: '제목을 입력해주세요'
  },
  pleaseMarkTheCorrectChoice: {
    en: 'Please mark the correct choice',
    kr: '정답을 선택해주세요'
  },
  posts: {
    en: 'Posts',
    kr: '게시물'
  },
  postSubject: {
    en: 'Post a subject users can talk about',
    kr: '대화 나누고 싶은 주제를 게시하세요'
  },
  postSubjectPlaceholder: {
    en: 'A subject users can talk about',
    kr: '무엇에 대해 이야기 나누고 싶으신가요?'
  },
  postContent: {
    en: 'Share interesting videos or webpages',
    kr: '흥미로운 동영상이나 웹페이지를 공유하세요'
  },
  questions: {
    en: 'Questions',
    kr: '문제'
  },
  questionTitle: {
    en: 'Question Title',
    kr: '문제'
  },
  recommended: {
    en: 'Recommended',
    kr: '추천'
  },
  recommendedPosts: {
    en: 'Recommended Posts',
    kr: '추천 게시물'
  },
  remove: {
    en: 'Remove',
    kr: '삭제'
  },
  reorder: {
    en: 'Reorder',
    kr: '순서 변경'
  },
  reorderQuestions: {
    en: 'Reorder Questions',
    kr: '문제 순서 변경하기'
  },
  reset: {
    en: 'Reset',
    kr: '초기화'
  },
  subject: {
    en: 'Subject',
    kr: '주제'
  },
  subjects: {
    en: 'Subjects',
    kr: '주제'
  },
  submit: {
    en: 'Submit',
    kr: '제출'
  },
  submit2: {
    en: 'Submit',
    kr: '등록'
  },
  thereAreNoQuestions: {
    en: 'There are no questions, yet',
    kr: '등록된 문제가 없습니다'
  },
  thereMustBeAtLeastTwoChoices: {
    en: 'There must be at least two choices',
    kr: '최소 두 개의 선택지를 입력해주세요'
  },
  undoDelete: {
    en: 'Undo',
    kr: '삭제취소'
  },
  untitledQuestion: {
    en: 'Untitled Question',
    kr: '문제'
  },
  video: {
    en: 'Video',
    kr: '동영상'
  },
  watching: {
    en: 'watching',
    kr: '시청하기'
  },
  xpVideos: {
    en: 'XP Videos',
    kr: 'XP 동영상'
  },
  youtubeVideo: {
    en: 'YouTube Video',
    kr: '유튜브 동영상'
  }
};
export default function localize(section) {
  return languageObj[section][selectedLanguage];
}
