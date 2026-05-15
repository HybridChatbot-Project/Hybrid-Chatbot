export function getResultByScore(score: number): number {
  var result = 0;
  if (score < 21) {
    result = 1;
  } else if (score >= 22 && score <= 35) {
    result = 2;
  } else {
    result = 3;
  }
  return result;
}

export function getResultNameByScore(score: number): string {
  if (score === 1) {
    return 'Ansiedad baja';
  } else if (score === 2) {
    return 'Ansiedad moderada';
  } else if (score === 3) {
    return 'Ansiedad severa';
  }
  return '';
}
