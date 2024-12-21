import Participants from "./Participants.jsx";
import {Link} from "react-router";
import {BigButton} from "./commonComponents.jsx";

export default function InputReview({ hist, names, setNames }) {
  if (hist.length === 0) {
    window.location.href = '/'
    return (<></>);
  }

  return (
    <div className={"flex flex-col"}>
      <div>
        <Participants hist={hist} names={names} setNames={setNames}/>
      </div>

      <div className={"py-3"}>
        <BigButton content={<Link to="/output">Continue</Link>}/>
      </div>
    </div>
  );
}