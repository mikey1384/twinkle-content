const selectedLanguage = process.env.REACT_APP_SELECTED_LANGUAGE;
const languageObj = {
  home: {
    en: 'Home',
    kr: '홈'
  }
};
export default function localize(section) {
  return languageObj[section][selectedLanguage];
}
