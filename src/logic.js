import wordlePuzzles from "./wordlePuzzles.js";

/**
 * Util
 */
export function oToA(o) {
  return Object.keys(o).map((k) => [k, o[k]])
}

export function byValsAscending(x) {
  return oToA(x).sort(([k1, v1], [k2, v2]) => v1 - v2);
}

export function byValsDescending(x) {
  return oToA(x).sort(([k1, v1], [k2, v2]) => v2 - v1);
}

/**
 * Puzzle repo
 */
export function puzzleByNumber(n) {
  return wordlePuzzles[n];
}

/**
 * Parse
 */
export function parseWordleHistory(text) {
  const lines = text.split('\n').map(l => l.trim());
  const data = [];
  let currentPerson = null;
  let currentWordle = null;

  const wordleRegex = /^Wordle\s+(\d[\d,]*)\s+([\dX])\/6$/;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Detect a person's name (ends with a colon)
    if (line.endsWith(':')) {
      currentPerson = line.slice(0, -1);
      continue;
    }

    // Detect a Wordle header line
    const match = line.match(wordleRegex);
    if (match && currentPerson) {
      // If there's a current unfinished wordle, finalize it first
      if (currentWordle && currentWordle.guesses.length > 0) {
        data.push(currentWordle);
      }
      // Start a new wordle
      const number = parseInt(match[1].replace(/,/g, ''), 10);
      const attempts = parseInt(match[2], 10);
      currentWordle = {
        person: currentPerson,
        number,
        attempts: isNaN(attempts) ? null : attempts,
        guesses: [] };
      continue;
    }

    // If we are currently tracking a Wordle game and this line looks like a guess line
    if (currentWordle && line && !line.endsWith(':') && /[⬜🟩🟨🟦🟪]/.test(line)) {
      currentWordle.guesses.push(line);
    } else if (currentWordle && line && !line.startsWith('Wordle')) {
      // We've moved on from this Wordle to another game or unrelated line
      if (currentWordle.guesses.length > 0) {
        data.push(currentWordle);
      }
      currentWordle = null;
    }
  }

  // If there's a leftover Wordle at the end
  if (currentWordle && currentWordle.guesses.length > 0) {
    data.push(currentWordle);
  }

  return data;
}

/**
 * Avg
 */
export function calculateAverageScores(wordleData) {
  // wordleData is expected to be an array of objects like:
  // { person: "Name", number: 1234, attempts: 4, guesses: [...] }

  const totals = {};
  const counts = {};

  for (const entry of wordleData) {
    if (!totals[entry.person]) {
      totals[entry.person] = 0;
      counts[entry.person] = 0;
    }
    totals[entry.person] += (entry.attempts || 7);
    counts[entry.person] += 1;
  }

  const averages = {};
  for (const person in totals) {
    averages[person] = totals[person] / counts[person];
  }

  return averages;
}

/**
 * Num failures
 */
export function calculateNumFailures(data) {
  const acc = {};
  const isFailure = x => x.attempts === null;
  for (const x of data) {
    if (isFailure(x)) {
      acc[x.person] = acc[x.person] ? acc[x.person] + 1 : 1;
    } else if (!acc[x.person]) {
      acc[x.person] = 0;
    }
  }
  return acc;
}

/**
 * Win Streak
 */
export function calculateLongestStreaks(data) {
  // data is an array of attempts like:
  // [
  //   { person: 'Mom', number: 1, attempts: 4 },
  //   { person: 'Mom', number: 2, attempts: null },
  //   ...
  // ]

  // Group attempts by person
  const byPerson = {};
  for (const entry of data) {
    if (!byPerson[entry.person]) {
      byPerson[entry.person] = [];
    }
    byPerson[entry.person].push(entry);
  }

  const results = {};

  for (const person in byPerson) {
    // Sort attempts by puzzle number
    const attempts = byPerson[person].sort((a, b) => a.number - b.number);

    let longestStreak = 0;
    let longestStart = null;
    let longestEnd = null;

    let currentStreak = 0;
    let currentStart = null;
    let prevNumber = null;
    let hadSuccess = false;

    for (const attempt of attempts) {
      // Consider success if attempts <= 6 and attempts is not null
      const success = (attempt.attempts !== null && attempt.attempts <= 6);
      if (success) {
        hadSuccess = true;
        if (prevNumber === null || attempt.number === prevNumber + 1) {
          // Continue or start a new streak
          currentStreak++;
          if (currentStart === null) currentStart = attempt.number;
        } else {
          // Non-consecutive success, finalize previous streak if it's the longest
          if (currentStreak > longestStreak) {
            longestStreak = currentStreak;
            longestStart = currentStart;
            longestEnd = prevNumber;
          }
          // Start a new streak
          currentStreak = 1;
          currentStart = attempt.number;
        }
        prevNumber = attempt.number;
      } else {
        // Failure breaks the current streak
        if (currentStreak > longestStreak) {
          longestStreak = currentStreak;
          longestStart = currentStart;
          longestEnd = prevNumber;
        }
        currentStreak = 0;
        currentStart = null;
        prevNumber = null;
      }
    }

    // Check the final streak
    if (currentStreak > longestStreak) {
      longestStreak = currentStreak;
      longestStart = currentStart;
      longestEnd = prevNumber;
    }

    if (!hadSuccess) {
      // No successes means longest streak is 0
      results[person] = { n: 0 };
    } else {
      // If longest streak is zero (but had some success), just return n:0
      // Otherwise return days as well
      if (longestStreak === 0) {
        results[person] = { n: 0 };
      } else {
        results[person] = { n: longestStreak, days: [longestStart, longestEnd] };
      }
    }
  }

  return results;
}

/**
 * Participation
 */
export function calculateParticipationRates(d) {
  const numbers = d.map(x => x.number);
  const minDay = Math.min(...numbers);
  const maxDay = Math.max(...numbers);
  const nDays = maxDay - minDay + 1;

  const acc = {};
  for (const { person, number } of d) {
    if (!acc[person]) {
      acc[person] = [number];
    } else {
      acc[person].push(number);
    }
  }
  return Object.fromEntries(Object.keys(acc).map(k => [k, new Set(acc[k]).size / nDays]));
}

/**
 * Hardest
 */
export function calculateHardestPuzzle(data) {
  // data is an array like:
  // [
  //   { person: 'Mom', number: 1043, attempts: 4, guesses: [...] },
  //   { person: 'Mom', number: 1044, attempts: null, guesses: [...] },
  //   { person: 'Sam', number: 1043, attempts: 3, guesses: [...] },
  //   ...
  // ]

  const byNumber = {};
  for (const entry of data) {
    if (!byNumber[entry.number]) {
      byNumber[entry.number] = { total: 0, attempts: {}, guesses: {} };
    }
    const att = (entry.attempts == null) ? 7 : entry.attempts;
    byNumber[entry.number].total += att;
    byNumber[entry.number].attempts[entry.person] = att;
    byNumber[entry.number].guesses[entry.person] = entry.guesses || [];
  }

  let hardestNumber = null;
  let maxAttempts = -1;

  for (const number in byNumber) {
    if (byNumber[number].total > maxAttempts) {
      maxAttempts = byNumber[number].total;
      hardestNumber = parseInt(number, 10);
    }
  }

  return {
    number: hardestNumber,
    attempts: byNumber[hardestNumber].attempts,
    guesses: byNumber[hardestNumber].guesses
  };
}

/**
 * Most fails
 */
export function calculateMostFailedPuzzle(data) {
  // data is an array like:
  // [
  //   { person: 'Mom', number: 1043, attempts: 4, guesses: [...] },
  //   { person: 'Mom', number: 1044, attempts: null, guesses: [...] },
  //   { person: 'Sam', number: 1043, attempts: 3, guesses: [...] },
  //   ...
  // ]

  const byNumber = {};
  for (const entry of data) {
    const att = (entry.attempts == null) ? 7 : entry.attempts;
    if (!byNumber[entry.number]) {
      byNumber[entry.number] = { fails: 0, attempts: {}, guesses: {} };
    }
    byNumber[entry.number].attempts[entry.person] = att;
    byNumber[entry.number].guesses[entry.person] = entry.guesses || [];

    // A fail is attempts >= 7
    if (att >= 7) {
      byNumber[entry.number].fails++;
    }
  }

  let mostFailedNumber = null;
  let maxFails = -1;

  for (const number in byNumber) {
    if (byNumber[number].fails > maxFails) {
      maxFails = byNumber[number].fails;
      mostFailedNumber = parseInt(number, 10);
    }
  }

  // It's possible that no puzzle had any fails. Handle that gracefully:
  if (mostFailedNumber === null) {
    return null; // or { fails: 0, attempts: {}, guesses: {} } if you prefer
  }

  return {
    number: mostFailedNumber,
    fails: byNumber[mostFailedNumber].fails,
    attempts: byNumber[mostFailedNumber].attempts,
    guesses: byNumber[mostFailedNumber].guesses
  };
}

/**
 * Easiest all-play
 */
export function calculateEasiestAllPlay(data) {
  // data is an array like:
  // [
  //   { person: 'Mom', number: 1043, attempts: 4, guesses: [...] },
  //   { person: 'Sam', number: 1043, attempts: null, guesses: [...] },
  //   { person: 'Mom', number: 1044, attempts: 3, guesses: [...] },
  //   ...
  // ]

  // First, get the set of all players
  const allPlayers = new Set(data.map(d => d.person));

  // Group attempts by puzzle number
  const byNumber = {};
  for (const entry of data) {
    const att = (entry.attempts == null) ? 7 : entry.attempts;
    if (!byNumber[entry.number]) {
      byNumber[entry.number] = { attempts: {}, guesses: {} };
    }
    byNumber[entry.number].attempts[entry.person] = att;
    byNumber[entry.number].guesses[entry.person] = entry.guesses || [];
  }

  // Count how many players participated in each puzzle and sum attempts
  for (const number in byNumber) {
    const puzzleData = byNumber[number];
    const puzzlePlayers = Object.keys(puzzleData.attempts);
    puzzleData.countPlayers = puzzlePlayers.length;
    puzzleData.total = puzzlePlayers.reduce((sum, p) => sum + puzzleData.attempts[p], 0);
  }

  // Find puzzles where all players participated
  const numPlayers = allPlayers.size;
  const commonPuzzles = Object.entries(byNumber).filter(([, puzzleData]) => {
    return puzzleData.countPlayers === numPlayers;
  });

  if (commonPuzzles.length === 0) {
    return null; // no puzzle where all players participated
  }

  // Among these, find the one with the lowest total
  commonPuzzles.sort((a, b) => a[1].total - b[1].total);
  const easiest = commonPuzzles[0]; // [number, data]

  return {
    number: parseInt(easiest[0], 10),
    total: easiest[1].total,
    attempts: easiest[1].attempts,
    guesses: easiest[1].guesses
  };
}
