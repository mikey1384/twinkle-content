export const clientVersion = '1.4.86';
export const defaultChatSubject = 'Welcome!';
export const defaultContentState = {
  isEditing: false,
  placeholderHeight: 0,
  rewards: [],
  comments: [],
  likes: [],
  questions: [],
  recommendations: [],
  subjects: [],
  tags: [],
  commentsLoadMoreButton: false,
  subjectsLoadMoreButton: false,
  rootObj: {},
  profileTheme: 'logoBlue'
};

export const cloudFrontURL = `https://${process.env.REACT_APP_CLOUDFRONT_KEY}.cloudfront.net`;
export const S3URL = `https://${process.env.REACT_APP_AWS_S3_BUCKET_NAME}.s3.amazonaws.com`;
export const TURN_USERNAME = process.env.REACT_APP_TURN_USERNAME;
export const TURN_PASSWORD = process.env.REACT_APP_TURN_PASSWORD;
export const descriptionLengthForExtraRewardLevel = 1000;
export const rewardValue = 200;
export const mb = 1000;
export const gifTable = {
  1: `${cloudFrontURL}/missions/copy-and-paste/thumb.gif`,
  2: `${cloudFrontURL}/missions/take-a-screenshot/thumb.gif`,
  3: `${cloudFrontURL}/missions/how-to-google/thumb.gif`,
  4: `${cloudFrontURL}/missions/grammar/thumb.gif`,
  5: `${cloudFrontURL}/missions/twinkle-store/thumb.gif`
};
export const priceTable = {
  chatSubject: 20,
  chatTheme: 30,
  username: 10,
  recommendation: 2,
  reward: 2
};
export const karmaPointTable = {
  username: 50,
  file: {
    0: 500,
    1: 1000,
    2: 2000,
    3: 10000,
    4: 25000,
    5: 50000,
    6: 100000
  },
  profilePicture: {
    0: 1000,
    1: 1500,
    2: 2000,
    3: 3000,
    4: 4000,
    5: 5000,
    6: 6000
  }
};
export const karmaMultiplier = {
  post: 3,
  recommendation: 10
};
export const charLimit = {
  chat: {
    subject: 200,
    message: 3500
  },
  comment: 10000,
  interactive: {
    heading: 150,
    description: 5000,
    youtube: 300
  },
  playlist: {
    title: 200,
    description: 5000
  },
  videoQuestion: {
    title: 2000,
    choice: 2000
  },
  subject: {
    title: 300,
    description: 20000
  },
  rewardComment: 5000,
  statusMsg: 500,
  url: {
    title: 300,
    description: 20000,
    url: 1000
  },
  video: {
    title: 200,
    description: 10000,
    url: 300
  }
};

export const rewardHash = {
  1: {
    label: 'basic',
    rewardAmount: 10,
    color: 'logoBlue'
  },
  2: {
    label: 'elementary',
    rewardAmount: 25,
    color: 'pink'
  },
  3: {
    label: 'intermediate',
    rewardAmount: 50,
    color: 'orange'
  },
  4: {
    label: 'advanced',
    rewardAmount: 100,
    coinAmount: 5,
    color: 'red'
  },
  5: {
    label: 'epic',
    rewardAmount: 500,
    coinAmount: 100,
    color: 'gold'
  }
};

export const rewardReasons = {
  1: {
    color: 'pink',
    icon: 'heart',
    message: 'for being considerate'
  },
  2: {
    color: 'logoBlue',
    icon: 'comments',
    message: 'for posting something related to the subject'
  },
  3: {
    color: 'orange',
    icon: 'surprise',
    message: 'for posting something interesting'
  },
  4: {
    color: 'gold',
    icon: 'bolt',
    message: 'for putting in a lot of effort'
  },
  5: {
    color: 'green',
    icon: 'check-circle',
    message: 'for participating in a group project or event'
  }
};

export const DEFAULT_PROFILE_THEME = 'logoBlue';
export const GENERAL_CHAT_ID = 2;
export const FILE_UPLOAD_XP_REQUIREMENT = 100000;
export const LAST_ONLINE_FILTER_LABEL = 'Last Online';
export const RANKING_FILTER_LABEL = 'Ranking';
export const MAX_PROFILE_PIC_SIZE = 10000;

export const returnMaxRewards = ({ rewardLevel }) => {
  let maxRewards = 5;
  if (rewardLevel > 0) {
    maxRewards = 10 * rewardLevel;
  }
  return maxRewards;
};

export const maxSizes = [300, 400, 500, 650, 800, 1000, 1500, 2000];

export const returnMaxUploadSize = (fileUploadLvl) => {
  return maxSizes[fileUploadLvl] * mb;
};

export function returnWordLevel({ frequency, word }) {
  const intermediateWordFrequency = 4;
  const advancedWordFrequency = 2.5;
  const epicWordFrequency = 1.6;

  if (!frequency) return 3;
  if (frequency > intermediateWordFrequency) {
    if (word.length < 7) return 1;
    return 2;
  }
  if (word.slice(-2) === 'ly') return 3;
  if (frequency > advancedWordFrequency) return 3;
  if (frequency > epicWordFrequency) return 4;
  if (frequency <= epicWordFrequency) return 5;
  return 3;
}
