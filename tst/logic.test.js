import { describe, expect, test } from 'vitest'
import {
  calculateNumFailures,
  calculateAverageScores,
  parseWordleHistory,
  calculateLongestStreaks, calculateParticipationRates, calculateHardestPuzzle
} from "../src/logic.js";

test('hardestPuzzle', () => {
  const data = [
    {person: 'Sam', number: 1, attempts: 6},
    {person: 'Mom', number: 2, attempts: null},
    {person: 'Sam', number: 2, attempts: 6},
    {person: 'Pauline', number: 2, attempts: 4},
    {person: 'Pauline', number: 4, attempts: 4},
    {person: 'Sam', number: 4, attempts: 1},
    {person: 'Helena', number: 5, attempts: 1}];
  expect(calculateHardestPuzzle(data)).toEqual({
    number: 2,
    attempts: { Mom: 7, Sam: 6, Pauline: 4}
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
