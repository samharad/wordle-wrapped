import {useEffect, useState} from 'react'
import Output from './Output.jsx';
import {Route, Routes} from "react-router";
import Input from "./Input.jsx";
import Home from "./Home.jsx";
import InputReview from "./InputReview.jsx";
import {parseWordleHistory} from "./logic.js";

function App() {
  const [rawHist, setRawHist] = useState("");
  const [width, setWidth] = useState(window.innerWidth);
  const [names, setNames] = useState({});

  const hist = (rawHist && rawHist.length > 0) ? parseWordleHistory(rawHist) : [];
  const histDerived = hist.map(x => ({ ...x, person: names[x.person] || x.person }));

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // Empty dependency array ensures this effect runs once on mount


  return (
    <>
      <div
        className={"text-center h-full"}
        // className="margin-auto max-w-lg mx-auto text-center"
      >
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/input" element={<Input rawHist={rawHist} setRawHist={setRawHist} />} />
          <Route path="/input-review" element={<InputReview hist={hist} names={names} setNames={setNames} />} />
          <Route path="/output" element={<Output histDerived={histDerived} width={width} />} />
        </Routes>
      </div>
    </>
    );
}

export default App
