import {Link} from "react-router";

export default function Input({ rawHist, setRawHist }) {


  function handleSubmit(e) {
    setRawHist(e.target.value);
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
                          value={rawHist}
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
              <Link to="/input-review">Continue</Link>
            </button>

          </li>

        </ol>
      </div>
    </>
  );
}