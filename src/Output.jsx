import Participants from "./Participants.jsx";
import { useState } from "react";
import {
  aToO,
  byValsAscending,
  byValsDescending,
  calculateAverageScoreByDayOfWeek,
  calculateAverageScores,
  calculateEasiestAllPlay, calculateGamesPerDayOfWeek,
  calculateHardestPuzzle,
  calculateLongestStreaks,
  calculateMonthlyAverages,
  calculateMostFailedPuzzle,
  calculateNumFailures,
  calculateParticipationRates, getHexColor,
  oToA,
  puzzleByNumber,
  restructureByDayMap,
  restructureMonthlyAverages, roundingVals, withRankings
} from "./logic.js";
import {Bar, BarChart, CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis} from "recharts";
import Carousel from "react-multi-carousel";
import 'react-multi-carousel/lib/styles.css';
import {BigButton, Card, MediumButton, SmallButton} from "./commonComponents.jsx";
import {Link} from "react-router";

const dRank = (rank, tieN) => {
  if (rank === 1) {
    return "🏆";
  } else if (rank === 2) {
    return "🏅";
  } else if (rank === 3) {
    return "🍪";
  } else if (rank === 4) {
    return "🍎";
  } else if (rank === 5) {
    return "🦴";
  } else if (rank === 6) {
    return "💨";
  } else {
    return "💩";
  }
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

export default function Output({ width, histDerived, demoMode }) {
  if (histDerived.length === 0) {
    window.location.href = '/';
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
  const dailyCounts = aToO(oToA(calculateGamesPerDayOfWeek(histDerived))
    .map(([d, p]) => [d.substring(0, 3), p]));

  const CustomDot = ({ onClick, index, active }) => {
    return (
      <button
        className={"text-lg"}
        onClick={onClick}
        style={{
          margin: "5px",
          cursor: "pointer",
          transition: "background-color 0.3s ease",
          scale: active ? "1.4" : "1"
        }}>
        ⭐️
      </button>
    );
  };

  const dDateSm = s => {
    const dateObj = new Date(s);
    const options = { year: '2-digit', month: 'numeric', day: 'numeric' };
    return dateObj.toLocaleDateString('en-US', options);
  }

  const PuzzleData = ({ puzzle: { number, date, word }}) => (
    <div className={"py-2"}>
      <span className={"font-bold px-2"}>{`${word}`}</span>
    </div>
  );

  const dPct = x => `${Math.round(x * 100)}%`;

  return (
    <>
      <div className={"flex flex-col justify-center h-full"}>
        <div className={"h-full text-2xl"}>

          <Carousel
            additionalTransfrom={0}
            arrows={!demoMode && width > 650}
            autoPlay={demoMode}
            autoPlaySpeed={1000}
            centerMode={false}
            className="h-full"
            containerClass="container-with-dots"
            customDot={demoMode ? <></> : <CustomDot/>}
            // customTransition="all 5s linear"
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
            transitionDuration={1000}
            swipeable
          >

            <Card title="🌟 Average Score">
              <table className={"table-auto m-auto"}>
                <tbody>
                {averages.map(([person, avg, rank, tieN], i) =>
                  <tr key={i}>
                    <td className={"p-1 px-5 text-left"}>{dRank(rank, tieN)}</td>
                    <td className={"p-1 px-5 text-left"}>{person}</td>
                    <td className={"p-1 px-5 text-left"}>{avg.toFixed(2)}</td>
                  </tr>
                )}
                </tbody>
              </table>
            </Card>

            <Card title={"💩 Failures"}>
              <table className={"table-auto m-auto"}>
                <tbody>
                {failures.map(([person, n, rank, tieN], i) =>
                  <tr key={i}>
                    <td className={"p-1 px-5 text-left"}>{dRank(rank, tieN)}</td>
                    <td className={"p-1 px-5 text-left"}>{person}</td>
                    <td className={"p-1 px-5 text-left"}>{n}</td>
                  </tr>
                )}
                </tbody>
              </table>
            </Card>

            <Card title={"💫 Longest Streak (days)"}>
              <table className={"table-auto m-auto"}>
                <tbody>
                {streaks.map(([person, {n, days}, rank, tieN], i) =>
                  <tr key={i}>
                    <td className={"p-1 px-5 text-left"}>{dRank(rank, tieN)}</td>
                    <td className={"p-1 px-5 text-left"}>{person}</td>
                    <td className={"p-1 px-5 text-left"}>{n}</td>
                    {/*<td className={"p-1 px-5 text-left text-sm"}>{n > 1 && "(#" + days[0] + " - " + days[1] + ")"}</td>*/}
                  </tr>
                )}
                </tbody>
              </table>
            </Card>

            <Card title={"👋 Participation Rate"}>
              <table className={"table-auto m-auto"}>
                <tbody>
                {participationRates.map(([person, r, rank, tieN], i) =>
                  <tr key={i}>
                    <td className={"p-1 px-5 text-left"}>{dRank(rank, tieN)}</td>
                    <td className={"p-1 px-5 text-left"}>{person}</td>
                    <td className={"p-1 px-5 text-left"}>{dPct(r)}</td>
                  </tr>
                )}
                </tbody>
              </table>
            </Card>

            <Card title={"😭 Hardest Puzzle (scores)"}>
              <div>
                <PuzzleData puzzle={hardestPuzzle}/>
                <div className={"flex flex-wrap justify-center"}>
                  {oToA(hardestData.guesses)
                    .sort(([p1, g1], [p2, g2]) => g1.length - g2.length)
                    .map(([person, guesses], i) =>
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
            </Card>

            <Card title={"😢 Hardest Puzzle (most fails)"}>
              <div>
                <PuzzleData puzzle={mostFailedPuzzle}/>
                <div className={"flex flex-wrap justify-center"}>
                  {oToA(mostFailedData.guesses)
                    .sort(([p1, g1], [p2, g2]) => g1.length - g2.length)
                    .map(([person, guesses], i) =>
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
            </Card>

            {easiestAllPlayData &&
              <Card title={"🍰 Easiest All-Play"}>
                <div>
                  <PuzzleData puzzle={easiestAllPlayPuzzle}/>
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
              </Card>}

            <Card title={"📈 Monthly Trends"}>
              <div className={"flex justify-center text-lg"}>
                <LineChart width={chartWidth} height={chartWidth} data={restructureMonthlyAverages(monthlyAverages)}>
                  <Legend formatter={(v, e, i) => v.length < 10 ? v : `${v.substring(0, 10)}...`}
                          verticalAlign={"bottom"}
                          height={36}
                  />
                  <Tooltip/>
                  <XAxis interval={1} dataKey="monthYear"/>
                  <YAxis domain={['dataMin - 1', 'dataMax + 1']}/>
                  <CartesianGrid stroke="#eee" strokeDasharray="5 5"/>
                  {Object.keys(monthlyAverages).map((k, i) =>
                    <Line key={i} type="linear" dataKey={k} stroke={getHexColor(i)}/>)}
                </LineChart>
              </div>
            </Card>

            <Card title={"☀️ Daily Submissions"}>
              <div className={"flex justify-center text-lg"}>
                <BarChart width={chartWidth} height={chartWidth} data={restructureByDayMap(dailyCounts)}>
                  <CartesianGrid strokeDasharray="3 3"/>
                  <XAxis dataKey="day"/>
                  <YAxis/>
                  <Tooltip/>
                  <Bar dataKey="n" fill="#bc4749"/>
                </BarChart>
              </div>
            </Card>

            {/*<Card title={"📊 Daily Averages"}>*/}
            {/*  <div className={"flex justify-center text-lg"}>*/}
            {/*    <BarChart width={chartWidth} height={chartWidth} data={restructureByDayMap(dailyAverages)}>*/}
            {/*      <CartesianGrid strokeDasharray="3 3"/>*/}
            {/*      <XAxis dataKey="day"/>*/}
            {/*      <YAxis domain={[1, 7]}/>*/}
            {/*      <Tooltip/>*/}
            {/*      <Bar dataKey="n" fill="#8884d8"/>*/}
            {/*    </BarChart>*/}
            {/*  </div>*/}
            {/*</Card>*/}

          </Carousel>

        </div>
      </div>
    </>
  );
}