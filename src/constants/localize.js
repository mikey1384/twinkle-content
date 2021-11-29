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
  AddPlaylist: {
    en: 'Add Playlist',
    kr: '재생목록 등록'
  },
  allPlaylists: {
    en: 'All Playlists',
    kr: '모든 재생목록'
  },
  allPosts: {
    en: 'All Posts',
    kr: '모든 게시물'
  },
  and: {
    en: ' and',
    kr: ','
  },
  beFirstToLikeThisVideo: {
    en: 'Be the first to like this video',
    kr: ''
  },
  boostRewardsFromWatchingXPVideos: {
    en: 'Boost rewards from watching XP Videos',
    kr: 'XP 동영상을 볼때 얻는 XP량 증가'
  },
  broughtBackBy: {
    en: 'Brought back by',
    kr: '재개자:'
  },
  by: {
    en: 'By',
    kr: '게시자:'
  },
  cancel: {
    en: 'Cancel',
    kr: '취소'
  },
  change: {
    en: 'Change',
    kr: '변경'
  },
  changePic: {
    en: 'Change Pic',
    kr: '사진 변경'
  },
  changePicture: {
    en: 'Change Picture',
    kr: '사진 변경'
  },
  changeUsername: {
    en: 'Change your username',
    kr: '유저명 변경하기'
  },
  changeVideos: {
    en: 'Change Videos',
    kr: '동영상 변경'
  },
  chat: {
    en: 'Chat',
    kr: '채팅'
  },
  chat2: {
    en: 'Chat',
    kr: '채팅하기'
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
  commentedOn: {
    en: 'commented on',
    kr: '댓글을 남겼습니다'
  },
  commentOnThisVideo: {
    en: 'Comment on this video',
    kr: '댓글 달기'
  },
  commentRemoved: {
    en: 'Comment removed / no longer available',
    kr: '댓글이 존재하지 않거나 삭제되었습니다'
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
  doesNotHaveBio: {
    en: ' does not have a bio, yet',
    kr: '님은 아직 자기소개글이 없습니다'
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
  editBio: {
    en: 'Edit Bio',
    kr: '소개글 변경'
  },
  editOrDelete: {
    en: 'Edit or Delete',
    kr: '수정/삭제'
  },
  editQuestion: {
    en: 'Edit Question',
    kr: '문제 수정하기'
  },
  editTitle: {
    en: 'Edit Title',
    kr: '제목 변경'
  },
  eitherRemovedOrNeverExisted: {
    en: 'It is either removed or never existed in the first place',
    kr: '존재하지 않거나 삭제되었습니다'
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
  enterNewUsername: {
    en: 'Enter New Username',
    kr: '새로운 유저명을 입력하세요'
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
  expandMaximumUploadSize: {
    en: 'Expand maximum upload file size',
    kr: '파일 업로드 용량 최대치 확장'
  },
  explore: {
    en: 'Explore',
    kr: '탐색'
  },
  fail: {
    en: 'Fail',
    kr: '실패'
  },
  featuredSubjects: {
    en: 'Featured',
    kr: '고정 주제'
  },
  featuredPlaylists: {
    en: 'Featured Playlists',
    kr: '추천 재생목록'
  },
  hideWatched: {
    en: 'Hide Watched',
    kr: '시청한 영상 숨기기'
  },
  home: {
    en: 'Home',
    kr: '홈'
  },
  imageTooLarge10MB: {
    en: 'Image is too large (limit: 10mb)',
    kr: '이미지 크기가 너무 큽니다 (최대 10mb)'
  },
  isNotValidUsername: {
    en: ' is not a valid username',
    kr: '는 사용 가능한 유저명이 아닙니다'
  },
  joinConversation: {
    en: 'Join Conversation',
    kr: '대화 참여하기'
  },
  karmaPoints: {
    en: 'Karma Points',
    kr: '카마포인트'
  },
  lastOnline: {
    en: 'Last online',
    kr: '최근 접속:'
  },
  lastOnline2: {
    en: 'Last Online',
    kr: '최근 접속순'
  },
  leaderboard: {
    en: 'Leaderboard',
    kr: '리더보드'
  },
  leftMessageTo: {
    en: 'left a message to',
    kr: '메시지를 남겼습니다'
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
  links: {
    en: 'Links',
    kr: '링크'
  },
  loadMore: {
    en: 'Load More',
    kr: '더 불러오기'
  },
  loading: {
    en: 'Loading',
    kr: '로딩중'
  },
  madeByUsers: {
    en: 'Made By Twinkle Users',
    kr: '사용자 제작 콘텐츠'
  },
  makeSure3CharLong: {
    en: `Make sure it is at least 3 characters long`,
    kr: '3글자 이상이어야 합니다'
  },
  mission: {
    en: 'Mission',
    kr: '미션'
  },
  missionAccomplished: {
    en: 'Mission Accomplished',
    kr: '미션 완료'
  },
  missionFailed: {
    en: 'Mission Failed',
    kr: '미션 실패'
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
    en: 'No description',
    kr: '소개글이 없습니다'
  },
  noPlaylists: {
    en: 'No playlists',
    kr: '재생목록이 존재하지 않습니다'
  },
  notEnoughTwinkleCoins: {
    en: `You don't have enough Twinkle Coins`,
    kr: '트윈클 코인이 부족합니다'
  },
  notRankedDescription: {
    en: 'You are not ranked. To get ranked, earn XP by completing missions, watching XP videos, or leaving comments',
    kr: '현재 XP가 없습니다. 미션을 완료하거나, XP 동영상을 시청하거나, 댓글을 남기시면 XP를 보상받으실 수 있습니다'
  },
  noUserMadeContent: {
    en: 'No user made content',
    kr: '사용자 제작 콘텐츠가 존재하지 않습니다'
  },
  noVideosToRecommend: {
    en: "We don't have any videos to recommend to you at the moment",
    kr: '지금은 추천드릴 영상이 없습니다'
  },
  oldToNew: {
    en: 'Old to New',
    kr: '오래된순'
  },
  optional: {
    en: '(Optional)',
    kr: '(선택사항)'
  },
  pass: {
    en: 'Pass',
    kr: '통과'
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
  playlistNotExist: {
    en: 'Playlist does not exist',
    kr: '존재하지 않는 재생목록입니다'
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
  pleaseSelectSmallerImage: {
    en: 'Please select a smaller image',
    kr: '더 작은 이미지를 선택해주세요'
  },
  posted: {
    en: 'Posted',
    kr: ''
  },
  postPicturesOnYourProfilePage: {
    en: 'Post pictures on your profile page',
    kr: '프로필 페이지에 사진 게시'
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
  profile: {
    en: 'profile',
    kr: '프로필'
  },
  questions: {
    en: 'Questions',
    kr: '문제'
  },
  questionTitle: {
    en: 'Question Title',
    kr: '문제'
  },
  randomHighXPSubject: {
    en: 'Random High XP Subject',
    kr: '무작위 고XP 주제'
  },
  ranking: {
    en: 'Ranking',
    kr: '랭킹순'
  },
  rankings: {
    en: 'Rankings',
    kr: '랭킹'
  },
  recommendation: {
    en: 'recommendation',
    kr: '추천'
  },
  recommended: {
    en: 'Recommended',
    kr: '추천'
  },
  recommendedSubjects: {
    en: 'Recommended',
    kr: '추천 주제'
  },
  recommendedVideos: {
    en: 'Recommended',
    kr: '추천 동영상'
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
  removePlaylist: {
    en: 'Remove Playlist',
    kr: '재생목록 삭제'
  },
  reorder: {
    en: 'Reorder',
    kr: '순서 변경'
  },
  reorderQuestions: {
    en: 'Reorder Questions',
    kr: '문제 순서 변경하기'
  },
  reorderVideos: {
    en: 'Reorder Videos',
    kr: '동영상 순서 변경'
  },
  reply: {
    en: 'Reply',
    kr: '답글'
  },
  repliedOn: {
    en: 'replied on',
    kr: '답글을 남겼습니다'
  },
  repliedTo: {
    en: 'replied to',
    kr: '답글을 남겼습니다'
  },
  reset: {
    en: 'Reset',
    kr: '초기화'
  },
  respond: {
    en: 'Respond',
    kr: '댓글'
  },
  respondedTo: {
    en: 'responded to',
    kr: '댓글을 남겼습니다'
  },
  reward: {
    en: 'Reward',
    kr: '포상'
  },
  rewards: {
    en: 'Rewards',
    kr: '선물'
  },
  searchPlaylists: {
    en: 'Search Playlists',
    kr: '재생목록 검색'
  },
  searchUsers: {
    en: 'Search Users',
    kr: '사용자 검색'
  },
  secretMessage: {
    en: 'Secret Message',
    kr: '비밀 메시지'
  },
  select: {
    en: 'Select',
    kr: '선택'
  },
  showAll: {
    en: 'Show All',
    kr: '전부 보기'
  },
  showMeAnotherSubject: {
    en: 'Show me another subject',
    kr: '다른 주제를 보여주세요'
  },
  startedBy: {
    en: 'Started by',
    kr: '개설자:'
  },
  startNewSubject: {
    en: 'Start a new subject',
    kr: '새로운 주제 개설하기'
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
  tapToCollectRewards: {
    en: 'Tap to collect all your rewards',
    kr: '모든 선물을 받으시려면 탭하세요'
  },
  task: {
    en: 'task',
    kr: '과제'
  },
  taskComplete: {
    en: 'Task Complete',
    kr: '과제 완료'
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
  unranked: {
    en: 'Unranked',
    kr: '랭킹없음'
  },
  untitledQuestion: {
    en: 'Untitled Question',
    kr: '문제'
  },
  uploadedBy: {
    en: 'Uploaded by',
    kr: '게시자:'
  },
  upNext: {
    en: 'Up Next',
    kr: '다음 영상'
  },
  user: {
    en: 'user',
    kr: ''
  },
  usernameAlreadyTaken: {
    en: `That username is already taken`,
    kr: '이미 사용중인 아이디입니다'
  },
  usernameAvailable: {
    en: `This username is available. Tap "Change"`,
    kr: '사용 가능한 아이디입니다'
  },
  video: {
    en: 'Video',
    kr: '동영상'
  },
  videos: {
    en: 'Videos',
    kr: '동영상 목록'
  },
  videos2: {
    en: 'Videos',
    kr: '동영상'
  },
  viewProfile: {
    en: 'View Profile',
    kr: '프로필'
  },
  visitWebsite: {
    en: 'Visit Website',
    kr: '웹사이트'
  },
  visitYoutube: {
    en: 'Visit YouTube',
    kr: '유튜브'
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
  yourTwinkleCoins: {
    en: 'Your Twinkle Coins',
    kr: '코인'
  },
  yourXP: {
    en: 'Your XP',
    kr: 'XP'
  },
  youtubeVideo: {
    en: 'YouTube Video',
    kr: '유튜브 동영상'
  }
};
export default function localize(section) {
  return languageObj?.[section]?.[selectedLanguage] || '';
}
