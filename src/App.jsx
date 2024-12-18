import {useEffect, useState} from 'react'
import Output from './Output.jsx';
import {Route, Routes} from "react-router";
import Input from "./Input.jsx";
import Home from "./Home.jsx";

function App() {
  const [hist, setHist] = useState([]);
  const [width, setWidth] = useState(window.innerWidth);

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
      <div className="margin-auto max-w-lg mx-auto text-center">
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/input" element={<Input hist={hist} setHist={setHist} />} />
          <Route path="/output" element={<Output hist={hist} width={width} />} />
        </Routes>
      </div>
    </>
    );
}

export default App
