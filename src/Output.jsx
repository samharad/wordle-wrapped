import Participants from "./Participants.jsx";
import { useState } from "react";
import {
  byValsAscending,
  byValsDescending,
  calculateAverageScores, calculateEasiestAllPlay, calculateHardestPuzzle,
  calculateLongestStreaks, calculateMostFailedPuzzle,
  calculateNumFailures, calculateParticipationRates, oToA, puzzleByNumber
} from "./logic.js";

export default function Output({ hist  }) {
  const [names, setNames] = useState({});

  if (hist.length === 0) {
    return (<></>);
  }
  const histDerived = hist.map(x => ({ ...x, person: names[x.person] || x.person }));

  const averages = byValsAscending(calculateAverageScores(histDerived));
  const failures = byValsAscending(calculateNumFailures(histDerived));
  const streaksUnsorted = calculateLongestStreaks(histDerived);
  const streaks = Object.keys(streaksUnsorted).map((k) => [k, streaksUnsorted[k]])
      .sort(([k1, v1], [k2, v2]) => v2.n - v1.n);
  const participationRates = byValsDescending(calculateParticipationRates(histDerived));
  const hardestData = calculateHardestPuzzle(histDerived);
  const hardestPuzzle = puzzleByNumber(hardestData.number);
  const mostFailedData = calculateMostFailedPuzzle(histDerived);
  const mostFailedPuzzle = puzzleByNumber(mostFailedData.number);
  const easiestAllPlayData = calculateEasiestAllPlay(histDerived);
  const easiestAllPlayPuzzle = easiestAllPlayData && puzzleByNumber(easiestAllPlayData.number);

  return (
    <>
      <Participants hist={hist} names={names} setNames={setNames} />
      <ol>

        <li>
          <div className="border rounded bg-white text-dark-green">
            <div className="text-2xl font-bold">⭐️ Average Score</div>
            <div>
              {averages.map(([person, avg], i) =>
                <div key={i}>
                  {i + 1}) {person} {(Math.round(avg * 100) / 100).toFixed(2)}
                </div>
              )}
            </div>
          </div>
        </li>

        <li>
          <div className="border rounded bg-white text-dark-green">
            <div className="text-2xl font-bold">💩 Failures</div>
            <div>
              {failures.map(([person, n], i) =>
                <div key={i}>
                  {i + 1}) {person} {n}
                </div>
              )}
            </div>
          </div>
        </li>

        <li>
          <div className="border rounded bg-white text-dark-green">
            <div className="text-2xl font-bold">💫 Longest Streak</div>
            <div>
              {streaks.map(([person, {n, days}], i) =>
                <div key={i}>
                  {i + 1}) {person} {n} {n > 1 && "(puzzles " + days[0] + " - " + days[1] + ")"}
                </div>
              )}
            </div>
          </div>
        </li>

        <li>
          <div className="border rounded bg-white text-dark-green">
            <div className="text-2xl font-bold">🏅 Participation Rate</div>
            <div>
              {participationRates.map(([person, r], i) =>
                <div key={i}>
                  {i + 1}) {person} {(Math.round(r * 100) / 100).toFixed(2)}
                </div>
              )}
            </div>
          </div>
        </li>

        <li>
          <div className="border rounded bg-white text-dark-green">
            <div className="text-2xl font-bold">😭 Hardest Puzzle (scores)</div>
            <div>
              {`${hardestPuzzle.number}, ${hardestPuzzle.date}: ${hardestPuzzle.word}`}
              {oToA(hardestData.guesses).map(([person, guesses], i) =>
                <div key={i}>
                  <div>
                    {person}
                  </div>
                  <div className="m-0 p-0 leading-none">
                    {guesses.map(line =>
                      <p>
                        {line}
                      </p>)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </li>

        <li>
          <div className="border rounded bg-white text-dark-green">
            <div className="text-2xl font-bold">😢 Hardest Puzzle (most fails)</div>
            <div>
              {`${mostFailedPuzzle.number}, ${mostFailedPuzzle.date}: ${mostFailedPuzzle.word}`}
              {oToA(mostFailedData.guesses).map(([person, guesses], i) =>
                <div key={i}>
                  <div>
                    {person}
                  </div>
                  <div className="m-0 p-0 leading-none">
                    {guesses.map(line =>
                      <p>
                        {line}
                      </p>)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </li>


        {easiestAllPlayData &&
          <li>
            <div className="border rounded bg-white text-dark-green">
              <div className="text-2xl font-bold">🍰 Easiest All-Play</div>
              <div>
                {`${easiestAllPlayPuzzle.number}, ${easiestAllPlayPuzzle.date}: ${easiestAllPlayPuzzle.word}`}
                {oToA(easiestAllPlayData.guesses).map(([person, guesses], i) =>
                  <div key={i}>
                    <div>
                      {person}
                    </div>
                    <div className="m-0 p-0 leading-none">
                      {guesses.map(line =>
                        <p>
                          {line}
                        </p>)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </li>}

      </ol>
    </>
  );
}