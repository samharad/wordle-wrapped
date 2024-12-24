import {useEffect, useState} from 'react'
import Output from './Output.jsx';
import {Link, Navigate, Route, Routes} from "react-router";
import Input from "./Input.jsx";
import Home from "./Home.jsx";
import InputReview from "./InputReview.jsx";
import {parseWordleHistory} from "./logic.js";
import SharedOutput from "./SharedOutput.jsx";
import GeneratedOutput from "./GeneratedOutput.jsx";
import Modal from 'react-modal';
import Login from "./Login.jsx";
import {db} from "./instantDb.js";
import {MediumButton, SmallButton} from "./commonComponents.jsx";
import About from "./About.jsx";

Modal.setAppElement('#root');

function App() {
  const [rawHist, setRawHist] = useState("");
  const [width, setWidth] = useState(window.innerWidth);
  const [names, setNames] = useState({});
  const { isLoading, user, error } = db.useAuth();

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
      <div className={"fixed bottom-4 left-4"} style={{zIndex: 99999}}>
        <div className={""}>
          <button
            className="text-xl bg-white text-dark-green hover:bg-dark-green hover:text-white font-semibold hover:text-white p-1 px-2 border border-blue-500 hover:border-transparent rounded"
          >
            <Link to={"/about"}>{"?"}</Link>
          </button>
        </div>
      </div>
      <div className={"fixed top-4 left-4"} style={{zIndex: 99999}}>
        <div className={""}>
          <button
            className="text-xl bg-white text-dark-green hover:bg-dark-green hover:text-white font-semibold hover:text-white p-1 px-2 border border-blue-500 hover:border-transparent rounded"
          >
            <Link to={""}>{"🏠"}</Link>
          </button>
        </div>
      </div>
      {window.location.href.includes("localhost") && user &&
        <div className={"fixed top-4 left-4"} style={{zIndex: 99999}}>
          <MediumButton content={"Sign Out"}
                        onClick={() => db.auth.signOut()}></MediumButton>
        </div>
      }
      <div className={"text-center h-full"}>
        <Routes>
          <Route path="/" element={<Home width={width} histDerived={histDerived}/>}/>
          <Route path="/input" element={<Input rawHist={rawHist} setRawHist={setRawHist} histDerived={histDerived}/>}/>
          <Route path="/input-review" element={<InputReview hist={hist} names={names} setNames={setNames}/>}/>
          <Route path="/output" element={<GeneratedOutput histDerived={histDerived} width={width}/>}/>
          <Route path="/share/:shortId" element={<SharedOutput width={width}/>}/>
          <Route path="/login" element={<Login width={width} histDerived={histDerived}/>}/>
          <Route path="/about" element={<About width={width}/>}/>
          <Route path="*" element={<Navigate to="/"/>}/>
        </Routes>
      </div>
    </>
  );
}

export default App
