import {parseWordleHistory} from "./logic.js";
import {Link} from "react-router";

export default function Input({ hist, setHist }) {


  function handleSubmit() {
    const input = document.getElementById('chat').value;
    const hist = parseWordleHistory(input);
    setHist(hist);
  }

  return (
    <>
      <div id="input-section">
        <ol>
          <li className="my-3">
            <div>
              <label htmlFor="chat">Paste your Wordle chat history:</label>
            </div>
            <div>
                <textarea id="chat"
                          className="bg-white text-dark-green p-2 rounded"
                          onChange={handleSubmit}>
                </textarea>
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
            <button className="bg-white text-red hover:bg-red hover:text-white font-bold px-4 rounded">
              <Link to="/output">Continue</Link>
            </button>

          </li>

        </ol>
      </div>
    </>
  );
}