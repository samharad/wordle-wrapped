import Participants from "./Participants.jsx";
import { useState } from "react";
import {
  byValsAscending,
  byValsDescending,
  calculateAverageScoreByDayOfWeek,
  calculateAverageScores,
  calculateEasiestAllPlay,
  calculateHardestPuzzle,
  calculateLongestStreaks,
  calculateMonthlyAverages,
  calculateMostFailedPuzzle,
  calculateNumFailures,
  calculateParticipationRates, getHexColor,
  oToA,
  puzzleByNumber,
  restructureDailyAvgs,
  restructureMonthlyAverages, roundingVals, withRankings
} from "./logic.js";
import {Bar, BarChart, CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis} from "recharts";
import Carousel from "react-multi-carousel";
import 'react-multi-carousel/lib/styles.css';

const dRank = (rank, tieN) => {
  return `${rank}${tieN? "t" : ""})`;
}

const responsive = {
  desktop: {
    breakpoint: {
      max: 3000,
      min: 1024
    },
    items: 1,
    partialVisibilityGutter: 200
  },
  mobile: {
    breakpoint: {
      max: 464,
      min: 0
    },
    items: 1,
    partialVisibilityGutter: 0
  },
  tablet: {
    breakpoint: {
      max: 1024,
      min: 464
    },
    items: 1,
    partialVisibilityGutter: 0
  }
};

export default function Output({ width, histDerived }) {
  if (histDerived.length === 0) {
    return (<></>);
  }

  const chartWidth = Math.min(Math.round(0.8*width), 450);

  const averages = withRankings(byValsAscending(roundingVals(calculateAverageScores(histDerived), 2)));
  const failures = withRankings(byValsAscending(calculateNumFailures(histDerived)));
  const streaksUnsorted = calculateLongestStreaks(histDerived);
  const streaks = withRankings(Object.keys(streaksUnsorted).map((k) => [k, streaksUnsorted[k]])
      .sort(([k1, v1], [k2, v2]) => v2.n - v1.n),
    x => x.n);
  const participationRates = withRankings(byValsDescending(roundingVals(calculateParticipationRates(histDerived), 2)));

  const hardestData = calculateHardestPuzzle(histDerived);
  const hardestPuzzle = puzzleByNumber(hardestData.number);
  const mostFailedData = calculateMostFailedPuzzle(histDerived);
  const mostFailedPuzzle = puzzleByNumber(mostFailedData.number);
  const easiestAllPlayData = calculateEasiestAllPlay(histDerived);
  const easiestAllPlayPuzzle = easiestAllPlayData && puzzleByNumber(easiestAllPlayData.number);
  const monthlyAverages = calculateMonthlyAverages(histDerived);
  const dailyAverages = calculateAverageScoreByDayOfWeek(histDerived);

  const commonClass =
   // "max-w-80";
   //  "";
    " md:mx-40 py-3 px-2";

  const CustomDot = ({ onClick, index, active }) => {
    return (
      <button
        onClick={onClick}
        style={{
          margin: "5px",
          cursor: "pointer",
          transition: "background-color 0.3s ease",
          scale: active ? "1.4" : "1"
        }}
      >
        ⭐️
      </button>
    );
  };

  return (
    <div className={"flex flex-col justify-center h-full"}>
      <div className={"h-full"}>

        <Carousel
          additionalTransfrom={0}
          arrows={width > 650}
          autoPlaySpeed={3000}
          centerMode={false}
          className="h-full"
          containerClass="container-with-dots"
          customDot={<CustomDot />}
          dotListClass=""
          draggable={false}
          focusOnSelect={false}
          infinite
          itemClass=""
          keyBoardControl
          minimumTouchDrag={80}
          partialVisible={false}
          pauseOnHover
          renderArrowsWhenDisabled={false}
          renderButtonGroupOutside={false}
          renderDotsOutside={false}
          responsive={responsive}
          rewind={false}
          rewindWithAnimation={false}
          rtl={false}
          shouldResetAutoplay
          showDots={true}
          sliderClass=""
          slidesToSlide={1}
          swipeable
        >

          <div className={"border rounded bg-white text-dark-green" + commonClass}>
            <div className="text-2xl font-bold">🌟 Average Score</div>
            <div>
              {averages.map(([person, avg, rank, tieN], i) =>
                <div key={i}>
                  {dRank(rank, tieN)} {person} {avg}
                </div>
              )}
            </div>
          </div>

          <div className={"border rounded bg-white text-dark-green" + commonClass}>
            <div className="text-2xl font-bold">💩 Failures</div>
            <div>
              {failures.map(([person, n, rank, tieN], i) =>
                <div key={i}>
                  {dRank(rank, tieN)} {person} {n}
                </div>
              )}
            </div>
          </div>

          <div className={"border rounded bg-white text-dark-green" + commonClass}>
            <div className="text-2xl font-bold">💫 Longest Streak</div>
            <div>
              {streaks.map(([person, {n, days}, rank, tieN], i) =>
                <div key={i}>
                  {dRank(rank, tieN)} {person} {n} {n > 1 && "(puzzles " + days[0] + " - " + days[1] + ")"}
                </div>
              )}
            </div>
          </div>

          <div className={"border rounded bg-white text-dark-green" + commonClass}>
            <div className="text-2xl font-bold">🏅 Participation Rate</div>
            <div>
              {participationRates.map(([person, r, rank, tieN], i) =>
                <div key={i}>
                  {dRank(rank, tieN)} {person} {r}
                </div>
              )}
            </div>
          </div>

          <div className={"border rounded bg-white text-dark-green" + commonClass}>
            <div className="text-2xl font-bold">😭 Hardest Puzzle (scores)</div>
            <div>
              {`${hardestPuzzle.number}, ${hardestPuzzle.date}: ${hardestPuzzle.word}`}
              <div className={"flex flex-wrap justify-center"}>
                {oToA(hardestData.guesses).map(([person, guesses], i) =>
                  <div key={i} className={"mx-3"}>
                    <div className={"truncate"}>
                      {person}
                    </div>
                    <div className="m-0 p-0 leading-none whitespace-pre">
                      {guesses.join("\n")}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className={"border rounded bg-white text-dark-green" + commonClass}>
            <div className="text-2xl font-bold">😢 Hardest Puzzle (most fails)</div>
            <div>
              {`${mostFailedPuzzle.number}, ${mostFailedPuzzle.date}: ${mostFailedPuzzle.word}`}
              <div className={"flex flex-wrap justify-center"}>
              {oToA(mostFailedData.guesses).map(([person, guesses], i) =>
                <div key={i} className={"mx-3"}>
                  <div className={"truncate max-w-24"}>
                    {person}
                  </div>
                  <div className="m-0 p-0 leading-none whitespace-pre">
                    {guesses.join("\n")}
                  </div>
                </div>
              )}
              </div>
            </div>
          </div>

          {easiestAllPlayData &&
            <div className={"border rounded bg-white text-dark-green" + commonClass}>
              <div className="text-2xl font-bold">🍰 Easiest All-Play</div>
              <div>
                {`${easiestAllPlayPuzzle.number}, ${easiestAllPlayPuzzle.date}: ${easiestAllPlayPuzzle.word}`}
                <div className={"flex flex-wrap justify-center"}>
                  {oToA(easiestAllPlayData.guesses).map(([person, guesses], i) =>
                    <div key={i} className={"mx-3"}>
                      <div className={"truncate"}>
                        {person}
                      </div>
                      <div className="m-0 p-0 leading-none whitespace-pre">
                        {guesses.join("\n")}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>}

          <div className={"border rounded bg-white text-dark-green" + commonClass}>
            <div className="text-2xl font-bold">📈 Monthly Trends</div>
            <div className={"flex justify-center"}>
              <LineChart width={chartWidth} height={chartWidth} data={restructureMonthlyAverages(monthlyAverages)}>
                <Legend verticalAlign="top" height={36}/>
                <Tooltip/>
                <XAxis dataKey="monthYear"/>
                <YAxis domain={[1, 7]}/>
                <CartesianGrid stroke="#eee" strokeDasharray="5 5"/>
                {Object.keys(monthlyAverages).map((k, i) =>
                  <Line type="linear" dataKey={k} stroke={getHexColor(i)}/>
                )}
              </LineChart>
            </div>
            <div>
            </div>
          </div>

          <div className={"border rounded bg-white text-dark-green" + commonClass}>
            <div className="text-2xl font-bold">📊 Daily Averages</div>
            <div className={"flex justify-center"}>
              <BarChart width={chartWidth} height={chartWidth} data={restructureDailyAvgs(dailyAverages)}>
                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis dataKey="day"/>
                <YAxis domain={[1, 7]}/>
                <Tooltip/>
                <Bar dataKey="n" fill="#8884d8"/>
              </BarChart>
            </div>
            <div>
            </div>
          </div>

        </Carousel>

      </div>
    </div>
  );
}