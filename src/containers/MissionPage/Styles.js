import { css } from 'emotion';
import { Color, borderRadius, mobileMaxWidth } from 'constants/css';

export const panel = css`
  width: 60%;
  background: #fff;
  padding: 1rem;
  border: 1px solid ${Color.borderGray()};
  border-radius: ${borderRadius};
  @media (max-width: ${mobileMaxWidth}) {
    width: 100%;
  }
`;
