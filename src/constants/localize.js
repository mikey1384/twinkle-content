const selectedLanguage = process.env.REACT_APP_SELECTED_LANGUAGE;
const languageObj = {
  add: {
    en: 'Add',
    kr: '추가'
  },
  addedBy: {
    en: 'Added by',
    kr: '게시자:'
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
  beFirstToLikeThisVideo: {
    en: 'Be the first to like this video',
    kr: ''
  },
  by: {
    en: 'By',
    kr: '게시자:'
  },
  cancel: {
    en: 'Cancel',
    kr: '취소'
  },
  changePicture: {
    en: 'Change Picture',
    kr: '사진 변경'
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
  comment: {
    en: 'Comment',
    kr: '댓글'
  },
  commentOnThisVideo: {
    en: 'Comment on this video',
    kr: '댓글 달기'
  },
  continue2: {
    en: 'Continue',
    kr: '이어서'
  },
  continueWatching: {
    en: 'Continue Watching',
    kr: '이어서 시청하기'
  },
  copyAndPasteUrl: {
    en: 'Copy and paste a URL address here',
    kr: 'URL 주소를 복사한 후 여기에 붙여넣으세요'
  },
  delete: {
    en: 'Delete',
    kr: '삭제'
  },
  done: {
    en: 'Done',
    kr: '완료'
  },
  earnXP: {
    en: 'Earn XP',
    kr: 'XP 쌓기'
  },
  edit: {
    en: 'Edit',
    kr: '수정'
  },
  editOrDelete: {
    en: 'Edit or Delete',
    kr: '수정/삭제'
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
  enterDetails: {
    en: 'Enter Details',
    kr: '상세정보를 입력하세요'
  },
  enterHeading: {
    en: 'Enter Heading',
    kr: '제목을 입력하세요'
  },
  enterQuestion: {
    en: 'Enter Question',
    kr: '문제를 입력하세요'
  },
  enterReply: {
    en: 'Enter Reply',
    kr: '답글을 입력하세요'
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
  joinConversation: {
    en: 'Join Conversation',
    kr: '대화 참여하기'
  },
  leaderboard: {
    en: 'Leaderboard',
    kr: '리더보드'
  },
  like: {
    en: 'Like',
    kr: '좋아요'
  },
  liked: {
    en: 'Liked',
    kr: '좋아요'
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
  myRanking: {
    en: 'My Ranking',
    kr: '내 순위'
  },
  newToOld: {
    en: 'New to Old',
    kr: '최신순'
  },
  news: {
    en: 'News',
    kr: '새소식'
  },
  newVideos: {
    en: 'New Videos',
    kr: '새로운 영상'
  },
  no: {
    en: 'No',
    kr: '아니오'
  },
  noDescription: {
    en: 'No Description',
    kr: '소개글 없음'
  },
  oldToNew: {
    en: 'Old to New',
    kr: '오래된순'
  },
  optional: {
    en: '(Optional)',
    kr: '(선택사항)'
  },
  people: {
    en: 'People',
    kr: '사람들'
  },
  peopleWhoLikeThisVideo: {
    en: 'People who like this video',
    kr: '이 영상을 좋아하는 사람들'
  },
  perMinute: {
    en: 'per minute',
    kr: '를 1분마다 획득'
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
  posted: {
    en: 'Posted',
    kr: ''
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
  rankings: {
    en: 'Rankings',
    kr: '랭킹'
  },
  recommended: {
    en: 'Recommended',
    kr: '추천'
  },
  recommendedBy: {
    en: 'Recommended by',
    kr: '추천자:'
  },
  recommendedPosts: {
    en: 'Recommended Posts',
    kr: '추천 게시물'
  },
  recommendQ: {
    en: 'Recommend?',
    kr: '추천하시겠습니까?'
  },
  relatedVideos: {
    en: 'Related Videos',
    kr: '연관된 영상'
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
  reward: {
    en: 'Reward',
    kr: '포상'
  },
  rewards: {
    en: 'Rewards',
    kr: '선물'
  },
  secretMessage: {
    en: 'Secret Message',
    kr: '비밀 메시지'
  },
  startNewSubject: {
    en: 'Start a new subject',
    kr: '새로운 주제 게시하기'
  },
  store: {
    en: 'Store',
    kr: '스토어'
  },
  stories: {
    en: 'Stories',
    kr: '스토리'
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
  submit3: {
    en: 'Submit',
    kr: '게시'
  },
  tapThisButtonToSubmit: {
    en: 'Tap this button to submit',
    kr: '이 버튼을 누르면 게시됩니다'
  },
  thereAreNoQuestions: {
    en: 'There are no questions, yet',
    kr: '등록된 문제가 없습니다'
  },
  thereMustBeAtLeastTwoChoices: {
    en: 'There must be at least two choices',
    kr: '최소 두 개의 선택지를 입력해주세요'
  },
  top30: {
    en: 'Top 30',
    kr: '톱 30'
  },
  undoDelete: {
    en: 'Undo',
    kr: '삭제취소'
  },
  untitledQuestion: {
    en: 'Untitled Question',
    kr: '문제'
  },
  upNext: {
    en: 'Up Next',
    kr: '다음 영상'
  },
  video: {
    en: 'Video',
    kr: '동영상'
  },
  videos: {
    en: 'Videos',
    kr: '동영상 목록'
  },
  viewProfile: {
    en: 'View Profile',
    kr: '프로필 보기'
  },
  watching: {
    en: 'watching',
    kr: '시청하기'
  },
  xpVideos: {
    en: 'XP Videos',
    kr: 'XP 동영상'
  },
  yes: {
    en: 'Yes',
    kr: '예'
  },
  you: {
    en: 'you',
    kr: '회원님'
  },
  youtubeVideo: {
    en: 'YouTube Video',
    kr: '유튜브 동영상'
  }
};
export default function localize(section) {
  return languageObj[section][selectedLanguage];
}
