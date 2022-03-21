import { css } from '@emotion/css';
import { Color } from 'constants/css';

export const gridContainer = css`
  .correct {
    border-color: ${Color.limeGreen()};
    background: ${Color.limeGreen()};
  }
  .present {
    border-color: ${Color.brownOrange()};
    background: ${Color.brownOrange()};
  }
  .absent {
    border-color: ${Color.blueGray()};
    background: ${Color.blueGray()};
  }

  .cell-fill-animation {
    animation: onTypeCell linear;
    animation-duration: 0.35s;
  }

  .cell-reveal {
    animation-duration: 0.35s;
    animation-timing-function: linear;
    animation-fill-mode: backwards;
    animation-name: revealCell;
  }

  .cell-reveal > .letter-container {
    animation: offsetLetterFlip 0.35s linear;
    animation-fill-mode: backwards;
  }

  .jiggle {
    animation: jiggle linear;
    animation-duration: 250ms;
  }

  @keyframes revealCell {
    0% {
      transform: rotateX(0deg);
    }
    100% {
      transform: rotateX(180deg);
    }
  }

  /* Additional animation on the child div to avoid letters turning upside down/snapping back to upright visual glitch */
  @keyframes offsetLetterFlip {
    0% {
      transform: rotateX(0deg);
    }
    100% {
      transform: rotateX(180deg);
    }
  }

  @keyframes onTypeCell {
    0% {
      transform: scale(1);
    }

    50% {
      transform: scale(1.1);
    }

    100% {
      transform: scale(1);
    }
  }

  @keyframes jiggle {
    0% {
      transform: translate(0, 0);
    }
    25% {
      transform: translate(-0.5rem, 0);
    }
    50% {
      transform: translate(0.5rem, 0);
    }
    75% {
      transform: translate(-0.5rem, 0);
    }
    100% {
      transform: translate(0, 0);
    }
  }
`;
