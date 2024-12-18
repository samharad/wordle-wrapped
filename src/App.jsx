import { useState } from 'react'
import Output from './Output.jsx';
import {Route, Routes} from "react-router";
import Input from "./Input.jsx";
import Home from "./Home.jsx";

function App() {
  const [hist, setHist] = useState([]);

  return (
    <>
      <div className="margin-auto max-w-lg mx-auto text-center">
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/input" element={<Input hist={hist} setHist={setHist} />} />
          <Route path="/output" element={<Output hist={hist} />} />
        </Routes>
      </div>
    </>
    );
}

export default App
