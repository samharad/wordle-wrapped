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

export function roundingVals(obj, n) {
  const result = {};
  for (const key in obj) {
    if (typeof obj[key] === 'number') {
      result[key] = Number(obj[key].toFixed(n));
    } else {
      // If it's not a number, just copy as is
      result[key] = obj[key];
    }
  }
  return result;
}

export function withRankings(tuples, scoreF = (x) => x) {
  if (tuples.length === 0) return [];

  let result = [];
  let prevScore = null;
  let nextRank = 1;      // The rank that will be assigned to the next new score
  let tieCount = 0;      // Number of items in the current tie group
  let tieGroupStart = 0; // Start index of the current tie group in the result array

  for (let i = 0; i < tuples.length; i++) {
    const [name, scoreRaw] = tuples[i];
    const score = scoreF(scoreRaw);

    if (prevScore === null) {
      // First entry
      result.push([name, scoreRaw, nextRank]);
      tieCount = 1;
      tieGroupStart = 0;
    } else if (score === prevScore) {
      // Tie with previous
      result.push([name, scoreRaw, nextRank]);
      tieCount++;
    } else {
      // A new score, so the previous tie group ends here
      if (tieCount > 1) {
        // Append tieCount to all tied entries
        for (let j = tieGroupStart; j < tieGroupStart + tieCount; j++) {
          result[j].push(tieCount);
        }
      }
      // Update nextRank by adding the number of players in the previous tie group
      nextRank += tieCount;
      // Start a new group
      tieCount = 1;
      tieGroupStart = i;
      result.push([name, scoreRaw, nextRank]);
    }

    prevScore = score;
  }

  // After the loop, check if the last group was a tie
  if (tieCount > 1) {
    for (let j = tieGroupStart; j < tieGroupStart + tieCount; j++) {
      result[j].push(tieCount);
    }
  }

  return result;
}

export function getHexColor(i) {
  const colors = [
    "#4CAF50", "#5C6BC0", "#FF5722", "#0288D1", "#388E3C", "#7B1FA2", "#D32F2F",
    "#303F9F", "#1976D2", "#C2185B", "#512DA8", "#00796B", "#8E24AA", "#689F38",
    "#E64A19", "#5D4037", "#455A64", "#AFB42B", "#F57C00", "#0288D1", "#6A1B9A",
    "#00897B", "#B71C1C", "#283593", "#1E88E5", "#AD1457", "#311B92", "#01579B",
    "#E65100", "#33691E", "#3E2723", "#1B5E20", "#4E342E", "#6200EA", "#0D47A1",
    "#1A237E", "#004D40", "#B71C1C", "#263238", "#673AB7", "#2E7D32", "#BF360C",
    "#3F51B5", "#D84315", "#37474F", "#2C387E", "#4A148C", "#004D40", "#1B5E20"
  ];
  return colors[i % colors.length];
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

  // Matches "Wordle 927 X/6" or "Wordle 1234 4/6"
  // Group 1: puzzle number (with possible commas)
  // Group 2: attempts (could be a number or 'X')
  const wordleRegex = /^Wordle\s+(\d[\d,]*)\s+([X\d])\/6$/;

  // Function to finalize currentWordle if it exists
  function finalizeWordle() {
    if (currentWordle && currentWordle.guesses.length > 0) {
      data.push(currentWordle);
    }
    currentWordle = null;
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Detect person line
    if (line.endsWith(':')) {
      // If we're starting a new person, finalize any existing wordle
      finalizeWordle();
      currentPerson = line.slice(0, -1);
      continue;
    }

    const match = line.match(wordleRegex);
    if (match && currentPerson) {
      // Starting a new Wordle game
      finalizeWordle();

      const number = parseInt(match[1].replace(/,/g, ''), 10);
      const attemptsStr = match[2];
      const attempts = attemptsStr === 'X' ? null : parseInt(attemptsStr, 10);

      currentWordle = { person: currentPerson, number, attempts, guesses: [] };
      continue;
    }

    // If we are currently in a Wordle block, try to parse guess lines.
    if (currentWordle) {
      // Guess lines contain Wordle squares: ⬜🟨🟩 etc.
      // We'll consider a guess line any line that has these chars and is not empty.
      if (/[⬜🟩🟨⬛️]/.test(line)) {
        currentWordle.guesses.push(line.match(/[⬜🟩🟨⬛️]/g)?.join(''));
      } else if (line !== '' && !line.startsWith('Wordle')) {
        // We hit a line that doesn't look like a guess or new Wordle line,
        // meaning the Wordle block is ended by some unrelated text.
        finalizeWordle();
        // We do not start a new Wordle here; we just end.
      }
    }
  }

  // End of input, finalize if still in a wordle
  finalizeWordle();

  for (const { guesses } of data) {
    for (const guessLine of guesses) {
      if (guessLine.replace(/[⬜🟩🟨⬛]/g, '').length !== 0) {
        throw "Invalid characters in guess" + guessLine.replace(/[⬜🟩🟨⬛]/g, '');
      }
    }
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

/**
 * Monthly averages
 */
export function calculateMonthlyAverages(data) {
  // data: array of attempts like:
  // [
  //   { person: 'Mom', number: 1043, attempts: 4 },
  //   { person: 'Mom', number: 1044, attempts: null },
  //   { person: 'Sam', number: 1043, attempts: 3 },
  //   ...
  // ]
  //
  // puzzleByNumber(n): returns { number, date: "December 13 2024", word: "BOXER" }
  //
  // Desired output:
  // {
  //   Mom: {
  //     "December 2024": averageScore,
  //     "January 2025": averageScore,
  //     ...
  //   },
  //   Sam: {
  //     ...
  //   }
  // }

  const results = {};

  for (const entry of data) {
    const puzzle = puzzleByNumber(entry.number);
    // If puzzle or puzzle.date is missing, skip
    if (!puzzle || !puzzle.date) continue;

    // Extract month and year from puzzle.date
    // date format: "December 13 2024"
    // We'll assume format is always "MonthName Day Year"
    const parts = puzzle.date.split(' ');
    // parts: ["December", "13", "2024"]
    const monthYear = parts[0] + ' ' + parts[2];

    const att = (entry.attempts == null) ? 7 : entry.attempts;

    if (!results[entry.person]) {
      results[entry.person] = {};
    }

    if (!results[entry.person][monthYear]) {
      results[entry.person][monthYear] = { total: 0, count: 0 };
    }

    results[entry.person][monthYear].total += att;
    results[entry.person][monthYear].count += 1;
  }

  // Convert totals to averages
  for (const person in results) {
    for (const monthYear in results[person]) {
      const { total, count } = results[person][monthYear];
      results[person][monthYear] = total / count;
    }
  }

  return results;
}

/**
 * For Recharts
 */
export function restructureMonthlyAverages(data) {
  // data shape:
  // {
  //   "Mom": { "April 2024": 3.8, "May 2024": 4.2, ... },
  //   "Pauline": { "April 2024": 3.6, ... }
  //   ...
  // }

  const monthMap = {
    January: 0,
    February: 1,
    March: 2,
    April: 3,
    May: 4,
    June: 5,
    July: 6,
    August: 7,
    September: 8,
    October: 9,
    November: 10,
    December: 11
  };

  // Collect all monthYears
  const allMonthYears = new Set();
  for (const person in data) {
    for (const monthYear in data[person]) {
      allMonthYears.add(monthYear);
    }
  }

  // Convert each monthYear into a structured form for sorting
  // monthYear = "December 2024"
  // We'll parse out month and year
  const parseMonthYear = (my) => {
    const parts = my.split(' ');
    const monthName = parts[0];
    const year = parseInt(parts[1], 10);
    return { monthIndex: monthMap[monthName], year };
  };

  const entries = [];
  for (const monthYear of allMonthYears) {
    const entry = { monthYear };
    for (const person in data) {
      if (data[person].hasOwnProperty(monthYear)) {
        entry[person] = data[person][monthYear];
      }
    }
    entries.push(entry);
  }

  // Sort chronologically
  entries.sort((a, b) => {
    const aParsed = parseMonthYear(a.monthYear);
    const bParsed = parseMonthYear(b.monthYear);
    if (aParsed.year === bParsed.year) {
      return aParsed.monthIndex - bParsed.monthIndex;
    }
    return aParsed.year - bParsed.year;
  });

  return entries.map(x => ({ ...x, monthYear: x.monthYear.substring(0, 3)}));
}

/**
 * Daily avg.
 */
export function calculateAverageScoreByDayOfWeek(data) {
  // data: array of attempts like:
  // [
  //   { person: 'Mom', number: 1043, attempts: 4 },
  //   { person: 'Sam', number: 1043, attempts: null },
  //   ...
  // ]
  //
  // puzzleByNumber(n) returns something like:
  // { number: 1273, date: "December 13 2024", word: "BOXER" }

  const dayOfWeekMap = {
    0: 'Sunday',
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday'
  };

  const totals = {}; // dayName -> { total: number, count: number }

  for (const entry of data) {
    const puzzle = puzzleByNumber(entry.number);
    if (!puzzle || !puzzle.date) continue;

    // Puzzle date format: "December 13 2024"
    const parts = puzzle.date.split(' ');
    if (parts.length < 3) continue;
    const [monthName, dayStr, yearStr] = parts;
    const day = parseInt(dayStr, 10);
    const year = parseInt(yearStr, 10);

    const monthMap = {
      January: 0, February: 1, March: 2, April: 3, May: 4, June: 5,
      July: 6, August: 7, September: 8, October: 9, November: 10, December: 11
    };
    const month = monthMap[monthName];
    if (month === undefined) continue;

    const dateObj = new Date(year, month, day);
    const dayOfWeek = dayOfWeekMap[dateObj.getDay()];
    if (!dayOfWeek) continue;

    const att = (entry.attempts == null) ? 7 : entry.attempts;

    if (!totals[dayOfWeek]) {
      totals[dayOfWeek] = { total: 0, count: 0 };
    }

    totals[dayOfWeek].total += att;
    totals[dayOfWeek].count += 1;
  }

  const averages = {};
  for (const day in totals) {
    const { total, count } = totals[day];
    averages[day] = total / count;
  }

  return Object.fromEntries(
    Object.entries(averages)
      .map(([d, s]) => [d.substring(0, 3), s]));
}

export function restructureDailyAvgs(data) {
  const dayOrder = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return Object.entries(data)
    .map(([day, n]) => ({ day, n }))
    .sort((a, b) => dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day));
}