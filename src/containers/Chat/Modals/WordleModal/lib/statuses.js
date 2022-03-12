import { solution, unicodeSplit } from './words';

export function getStatuses(guesses) {
  const charObj = {};
  const splitSolution = unicodeSplit(solution);

  guesses.forEach((word) => {
    unicodeSplit(word).forEach((letter, i) => {
      if (!splitSolution.includes(letter)) {
        return (charObj[letter] = 'absent');
      }

      if (letter === splitSolution[i]) {
        return (charObj[letter] = 'correct');
      }

      if (charObj[letter] !== 'correct') {
        return (charObj[letter] = 'present');
      }
    });
  });

  return charObj;
}

export function getGuessStatuses(guess) {
  const splitSolution = unicodeSplit(solution);
  const splitGuess = unicodeSplit(guess);

  const solutionCharsTaken = splitSolution.map(() => false);

  const statuses = Array.from(Array(guess.length));

  // handle all correct cases first
  splitGuess.forEach((letter, i) => {
    if (letter === splitSolution[i]) {
      statuses[i] = 'correct';
      solutionCharsTaken[i] = true;
      return;
    }
  });

  splitGuess.forEach((letter, i) => {
    if (statuses[i]) return;

    if (!splitSolution.includes(letter)) {
      // handles the absent case
      statuses[i] = 'absent';
      return;
    }

    // now we are left with "present"s
    const indexOfPresentChar = splitSolution.findIndex(
      (x, index) => x === letter && !solutionCharsTaken[index]
    );

    if (indexOfPresentChar > -1) {
      statuses[i] = 'present';
      solutionCharsTaken[indexOfPresentChar] = true;
      return;
    } else {
      statuses[i] = 'absent';
      return;
    }
  });

  return statuses;
}
