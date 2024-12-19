import Participants from "./Participants.jsx";
import {Link} from "react-router";

export default function InputReview({ hist, names, setNames }) {
  if (hist.length === 0) {
    return (<></>);
  }

  return (
    <>

      <ol>
        <li className="my-3">
          <Participants hist={hist} names={names} setNames={setNames}/>
        </li>

        <li className="my-3">
          <button className="bg-white text-red hover:bg-red hover:text-white font-bold px-4 rounded">
            <Link to="/output">Continue</Link>
          </button>
        </li>
      </ol>


    </>
  );
}