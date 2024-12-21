import {useEffect, useState} from 'react'
import Output from './Output.jsx';
import {Route, Routes} from "react-router";
import Input from "./Input.jsx";
import Home from "./Home.jsx";
import InputReview from "./InputReview.jsx";
import {parseWordleHistory} from "./logic.js";
import SharedOutput from "./SharedOutput.jsx";
import GeneratedOutput from "./GeneratedOutput.jsx";
import Modal from 'react-modal';

Modal.setAppElement('#root');

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
      <div className={"text-center h-full"}>
        <Routes>
          <Route path="/" element={<Home  width={width} histDerived={histDerived} />}/>
          <Route path="/input" element={<Input rawHist={rawHist} setRawHist={setRawHist} histDerived={histDerived}/>} />
          <Route path="/input-review" element={<InputReview hist={hist} names={names} setNames={setNames} />} />
          <Route path="/output" element={<GeneratedOutput histDerived={histDerived} width={width} />} />
          <Route path="/share/:shortId" element={<SharedOutput width={width} />} />
        </Routes>
      </div>
    </>
    );
}

export default App
