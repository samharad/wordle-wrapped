import { describe, expect, test } from 'vitest'
import {
  calculateNumFailures,
  calculateMostFailedPuzzle,
  calculateAverageScores,
  parseWordleHistory,
  calculateLongestStreaks,
  calculateParticipationRates,
  calculateHardestPuzzle,
  calculateEasiestAllPlay,
  calculateMonthlyAverages, calculateAverageScoreByDayOfWeek
} from "../src/logic.js";

test('dailyAverages', () => {
  const data = [
    {person: 'Sam', number: 1277, attempts: 6},
    {person: 'Sam', number: 1278, attempts: 6},
    {person: 'Helena', number: 1278, attempts: 2}];
  expect(calculateAverageScoreByDayOfWeek(data)).toEqual({
    Tue: 6,
    Wed: 4
  });
});

test('monthlyAverages', () => {
  const data = [
    {person: 'Sam', number: 1230, attempts: 2},
    {person: 'Sam', number: 1277, attempts: 2},
    {person: 'Sam', number: 1278, attempts: 6},
    {person: 'Helena', number: 1278, attempts: 1}];
  expect(calculateMonthlyAverages(data)).toEqual({
    Sam: { "December 2024": 4, "October 2024": 2 },
    Helena: { "December 2024": 1 }
  });
});

test('easiestAllPlay', () => {
  const data = [
    {person: 'Sam', number: 1, attempts: 6},
    {person: 'Mom', number: 2, attempts: null, guesses: ["fake"]},
    {person: 'Sam', number: 2, attempts: 6},
    {person: 'Pauline', number: 2, attempts: 4},
    {person: 'Pauline', number: 3, attempts: 1},
    {person: 'Sam', number: 3, attempts: 1, guesses: ["fake"]},
    {person: 'Helena', number: 3, attempts: 1},
    {person: 'Mom', number: 3, attempts: 1},
    {person: 'Pauline', number: 4, attempts: 4},
    {person: 'Sam', number: 4, attempts: 1},
    {person: 'Helena', number: 5, attempts: 1}];
  expect(calculateEasiestAllPlay(data)).toEqual({
    number: 3,
    attempts: { Mom: 1, Sam: 1, Pauline: 1, Helena: 1},
    guesses: { Sam: ["fake"], Mom: [], Pauline: [], Helena: []},
    total: 4
  });

  const data1 = [
    {person: 'Sam', number: 1, attempts: 6},
    {person: 'Mom', number: 2, attempts: null, guesses: ["fake"]},
    {person: 'Sam', number: 2, attempts: 6},
    {person: 'Pauline', number: 2, attempts: 4},
    {person: 'Pauline', number: 3, attempts: 1},
    {person: 'Sam', number: 3, attempts: 1, guesses: ["fake"]},
    {person: 'Mom', number: 3, attempts: 1},
    {person: 'Pauline', number: 4, attempts: 4},
    {person: 'Sam', number: 4, attempts: 1},
    {person: 'Helena', number: 5, attempts: 1}];
  expect(calculateEasiestAllPlay(data1)).toEqual(null);
})

test('mostFailedPuzzle', () => {
  const data = [
    {person: 'Sam', number: 1, attempts: 6},
    {person: 'Mom', number: 2, attempts: null, guesses: ["fake"]},
    {person: 'Sam', number: 2, attempts: 6},
    {person: 'Pauline', number: 2, attempts: 4},
    {person: 'Pauline', number: 4, attempts: 4},
    {person: 'Sam', number: 4, attempts: 1},
    {person: 'Helena', number: 5, attempts: 1}];
  expect(calculateMostFailedPuzzle(data)).toEqual({
    number: 2,
    attempts: { Mom: 7, Sam: 6, Pauline: 4},
    guesses: { Sam: [], Mom: ["fake"], Pauline: []},
    fails: 1
  });
})

test('hardestPuzzle', () => {
  const data = [
    {person: 'Sam', number: 1, attempts: 6},
    {person: 'Mom', number: 2, attempts: null, guesses: ["fake"]},
    {person: 'Sam', number: 2, attempts: 6},
    {person: 'Pauline', number: 2, attempts: 4},
    {person: 'Pauline', number: 4, attempts: 4},
    {person: 'Sam', number: 4, attempts: 1},
    {person: 'Helena', number: 5, attempts: 1}];
  expect(calculateHardestPuzzle(data)).toEqual({
    number: 2,
    attempts: { Mom: 7, Sam: 6, Pauline: 4},
    guesses: { Sam: [], Mom: ["fake"], Pauline: []}
  });
});

describe('calculateParticipationRates', () => {
  test('should work', () => {
    const data = [
      {person: 'Sam', number: 1, attempts: 6},
      {person: 'Mom', number: 2, attempts: null},
      {person: 'Sam', number: 2, attempts: 6},
      {person: 'Pauline', number: 2, attempts: 4},
      {person: 'Pauline', number: 4, attempts: 4},
      {person: 'Sam', number: 4, attempts: 1},
      {person: 'Helena', number: 5, attempts: 1}];
    expect(calculateParticipationRates(data)).toEqual({
      Sam: 3 / 5,
      Mom: 1 / 5,
      Pauline: 2 / 5,
      Helena: 1 / 5
    });
  })
});

describe('calculateLongestStreams', () => {
  test('should work even for those without wins', () => {
    const data = [
      {person: 'Sam', number: 1, attempts: 6},
      {person: 'Mom', number: 2, attempts: null},
      {person: 'Sam', number: 2, attempts: 6},
      {person: 'Pauline', number: 2, attempts: 4},
      {person: 'Pauline', number: 4, attempts: 4},
      {person: 'Sam', number: 4, attempts: 1},
      {person: 'Helena', number: 5, attempts: 1}];
    expect(calculateLongestStreaks(data)).toEqual({
      Sam: { n: 2, days: [1, 2]},
      Mom: { n: 0},
      Pauline: { n: 1, days: [2, 2] },
      Helena: { n: 1, days: [ 5, 5]}
    });
  });
});

describe('calculateAverageScores', () => {
  test('should treat failure as 7', () => {
    const data = [
      {person: 'Sam', attempts: 1},
      {person: 'Sam', attempts: null},
      {person: 'Sam', attempts: null},
      {person: 'Helena', attempts: 1},
      {person: 'Mom', attempts: null}];
    expect(calculateAverageScores(data)).toEqual({
      Sam: 5.0,
      Helena: 1.0,
      Mom: 7.0
    });
  });
});

describe('calculateNumFailures', () => {
  test('basic case', () => {
    const data = [
      {person: 'Sam', attempts: 1},
      {person: 'Sam', attempts: null},
      {person: 'Sam', attempts: null},
      {person: 'Helena', attempts: null},
      {person: 'Helena', attempts: 1},
      {person: 'Mom', attempts: null}];
    expect(calculateNumFailures(data)).toEqual({
      Sam: 2,
      Helena: 1,
      Mom: 1
    });
  });
});

describe('parseWordleHistory', () => {
  test('handle unsuccessful games', () => {
    const s = `
Pauline:
\tWordle 1,039 X/6

⬜⬜⬜⬜🟨
🟨⬜🟨⬜⬜
🟨⬜⬜🟩🟩
⬜🟩⬜🟩🟩
⬜🟩⬜🟩🟩
⬜🟩⬜🟩🟩
    `;
    expect(parseWordleHistory(s)).toEqual([
      {person: 'Pauline',
       number: 1039,
       attempts: null,
       guesses: [
         "⬜⬜⬜⬜🟨",
         "🟨⬜🟨⬜⬜",
         "🟨⬜⬜🟩🟩",
         "⬜🟩⬜🟩🟩",
         "⬜🟩⬜🟩🟩",
         "⬜🟩⬜🟩🟩"
       ]}
    ]);
  });
  test('parses single text', () => {
    const s = `
Mom:
\tWordle 1,043 4/6

⬜🟩🟩🟩⬜
⬜🟩🟩🟩⬜
⬜🟩🟩🟩⬜
🟩🟩🟩🟩🟩
    `;
    expect(parseWordleHistory(s)).toEqual([
      { person: 'Mom',
        number: 1043,
        attempts: 4,
        guesses: [
          "⬜🟩🟩🟩⬜",
          "⬜🟩🟩🟩⬜",
          "⬜🟩🟩🟩⬜",
          "🟩🟩🟩🟩🟩"]}]);
  });
});
