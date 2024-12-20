import {Link} from "react-router";
import {BigButton} from "./commonComponents.jsx";

export default function Input({ rawHist, setRawHist }) {


  function handleSubmit(e) {
    setRawHist(e.target.value);
  }

  return (
    <div>
      <div className="text-2xl p-3">Copy your Wordle group chat history</div>

      {/*<ol>*/}
      {/*  <li className="my-3">*/}
      {/*    <div>*/}
      {/*      <label htmlFor="chat">Paste your Wordle chat history:</label>*/}
      {/*    </div>*/}
      {/*    <div>*/}
      {/*          <textarea id="chat"*/}
      {/*                    className="bg-white text-dark-green p-2 rounded"*/}
      {/*                    value={rawHist}*/}
      {/*                    onChange={handleSubmit}>*/}
      {/*          </textarea>*/}
      {/*    </div>*/}
      {/*  </li>*/}

      {/*  <li className="my-3">*/}
      {/*    <BigButton content={<Link to="/input-review">Continue</Link>}/>*/}
      {/*  </li>*/}

        {/*<li className="my-3">*/}
        {/*  <div>*/}
        {/*    <label htmlFor="group-name">Enter a group name (optional):</label>*/}
        {/*  </div>*/}
        {/*  <div>*/}
        {/*    <input id="group-name" className="bg-white text-dark-green p-2 rounded" type="text"/>*/}
        {/*  </div>*/}
        {/*</li>*/}

      {/*</ol>*/}
    </div>
  );
}