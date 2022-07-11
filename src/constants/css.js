export const Color = {
  blue: (opacity = 1) => `rgba(5,110,178,${opacity})`,
  lightBlue: (opacity = 1) => `rgba(117,192,255,${opacity})`,
  darkBlue: (opacity = 1) => `rgba(0,70,195,${opacity})`,
  logoBlue: (opacity = 1) => `rgba(65, 140, 235,${opacity})`,
  oceanBlue: (opacity = 1) => `rgba(33,150,243,${opacity})`,
  black: (opacity = 1) => `rgba(51,51,51,${opacity})`,
  brown: (opacity = 1) => `rgba(139,69,19,${opacity})`,
  sandyBrown: (opacity = 1) => `rgba(230,204,96,${opacity})`,
  bronze: (opacity = 1) => `rgba(255,190,130,${opacity})`,
  cyan: (opacity = 1) => `rgba(0,255,255,${opacity})`,
  darkCyan: (opacity = 1) => `rgba(0,139,139,${opacity})`,
  gold: (opacity = 1) => `rgba(255,206,0,${opacity})`,
  logoGreen: (opacity = 1) => `rgba(97,226,101,${opacity})`,
  green: (opacity = 1) => `rgba(40,182,44,${opacity})`,
  limeGreen: (opacity = 1) => `rgba(34, 197, 94,${opacity})`,
  yellowGreen: (opacity = 1) => `rgba(154,204,96,${opacity})`,
  lightCyan: (opacity = 1) => `rgba(224,255,255,${opacity})`,
  darkerGray: (opacity = 1) => `rgba(85,85,85,${opacity})`,
  darkGray: (opacity = 1) => `rgba(115,115,115,${opacity})`,
  gray: (opacity = 1) => `rgba(153,153,153,${opacity})`,
  lightGray: (opacity = 1) => `rgba(165,165,165,${opacity})`,
  darkerBorderGray: (opacity = 1) => `rgba(185,188,190,${opacity})`,
  lighterGray: (opacity = 1) => `rgba(207,207,207,${opacity})`,
  blueGray: (opacity = 1) => `rgba(61,75,95,${opacity})`,
  lightBlueGray: (opacity = 1) => `rgba(91,105,125,${opacity})`,
  darkBlueGray: (opacity = 1) => `rgba(41,55,75,${opacity})`,
  borderGray: (opacity = 1) => `rgba(204,204,204,${opacity})`,
  checkboxAreaGray: (opacity = 1) => `rgba(229,229,229,${opacity})`,
  targetGray: (opacity = 1) => `rgba(218,218,230,${opacity})`,
  wellGray: (opacity = 1) => `rgba(235,235,235,${opacity})`,
  inputGray: (opacity = 1) => `rgba(238,238,245,${opacity})`,
  highlightGray: (opacity = 1) => `rgba(242,242,242,${opacity})`,
  whiteGray: (opacity = 1) => `rgba(250,250,250,${opacity})`,
  ivory: (opacity = 1) => `rgba(255,255,240,${opacity})`,
  brownOrange: (opacity = 1) => `rgba(245,190,70,${opacity})`,
  orange: (opacity = 1) => `rgba(255,140,0,${opacity})`,
  pink: (opacity = 1) => `rgba(255,105,180,${opacity})`,
  purple: (opacity = 1) => `rgba(152,28,235,${opacity})`,
  lightPurple: (opacity = 1) => `rgba(248,246,255,${opacity})`,
  red: (opacity = 1) => `rgba(255,65,54,${opacity})`,
  darkRed: (opacity = 1) => `rgba(139,0,0,${opacity})`,
  cranberry: (opacity = 1) => `rgba(230,80,112,${opacity})`,
  passionFruit: (opacity = 1) => `rgba(243,103,123,${opacity})`,
  rose: (opacity = 1) => `rgba(223,0,102,${opacity})`,
  vantaBlack: (opacity = 1) => `rgba(0,0,0,${opacity})`,
  white: (opacity = 1) => `rgba(255,255,255,${opacity})`,
  yellow: (opacity = 1) => `rgba(253,253,150,${opacity})`
};

export const strongColors = ['rose', 'red', 'purple'];

export function Theme(color) {
  return {
    alreadyPostedByOtherUser: { color: 'red' },
    alreadyPostedByThisUser: { color: 'blue' },
    button: { color },
    byUserIndicator: {
      color,
      opacity: strongColors.includes(color) ? 0.7 : 0.9
    },
    carousel: { color },
    carouselProgress: { color: 'logoBlue' },
    carouselProgressComplete: { color: 'blue' },
    comment: { color: 'green' },
    content: { color: 'green' },
    cover: { color },
    generalChat: {
      color: color === 'black' || color === 'vantablack' ? 'darkBlue' : color
    },
    chatFlatButton: {
      color,
      opacity: 0.8
    },
    chatInvitation: { color },
    homeMenuItemActive: { color },
    itemSelected: { color, opacity: strongColors.includes(color) ? 0.7 : 0.8 },
    likeButton: { color: 'lightBlue' },
    likeButtonPressed: { color: 'logoBlue' },
    link: { color: 'blue' },
    loadMoreButton: { color: 'lightBlue' },
    login: { color: 'green' },
    logoTwin: { color: 'logoBlue' },
    logoKle: { color: 'logoGreen' },
    mainFilter: { color, opacity: 0.7 },
    mission: { color: 'orange' },
    profilePanel: { color },
    progressBar: { color },
    reactionButton: { color, opacity: 0.2 },
    rewardLevelForm: { color, opacity: strongColors.includes(color) ? 0.9 : 1 },
    rewardableRecommendation: { color, opacity: 0.1 },
    search: { color },
    sectionPanel: { color },
    showMeAnotherSubjectButton: { color: 'green' },
    skeuomorphicDisabled: { color, opacity: 0.2 },
    spinner: { color },
    success: { color: 'green' },
    subject: { color: 'green' },
    switch: { color },
    tableHeader: { color },
    userLink: { color, opacity: 0.9 },
    xpNumber: { color: 'logoGreen' }
  };
}

export const borderRadius = '5px';
export const innerBorderRadius = '4px';
export const mobileMaxWidth = '850px';
export const desktopMinWidth = '851px';
