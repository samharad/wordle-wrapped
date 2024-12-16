import { useState } from 'react'
import { parseWordleHistory } from "./logic.js";
import Output from './Output.jsx';

function App() {
  const [hist, setHist] = useState([]);

  function handleSubmit() {
    const input = document.getElementById('chat').value;
    const hist = parseWordleHistory(input);
    setHist(hist);
  }

  return (
    <>
      <div className="margin-auto max-w-lg mx-auto text-center">

        <h1 className="text-3xl">Welcome to Wordle Wrapped!</h1>

        <div id="input-section">
          <ol>
            <li className="my-3">
              <div>
                <label htmlFor="chat">Paste your Wordle chat history:</label>
              </div>
              <div>
                <textarea id="chat" className="bg-white text-dark-green p-2 rounded"></textarea>
              </div>
            </li>

            <li className="my-3">
              <div>
                <label htmlFor="group-name">Enter a group name (optional):</label>
              </div>
              <div>
                <input id="group-name" className="bg-white text-dark-green p-2 rounded" type="text"/>
              </div>
            </li>

            <li className="my-3">
              <button className="bg-white text-red hover:bg-red hover:text-white font-bold px-4 rounded"
                      onClick={handleSubmit}>
                Submit
              </button>
            </li>
          </ol>
        </div>

        <div id="output-section">
          <Output hist={hist} />
        </div>

      </div>

    </>
    );
}

export default App
