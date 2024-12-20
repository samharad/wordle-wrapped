import {MediumButton} from "./commonComponents.jsx";
import {addHist} from "./instantDb.js";
import Output from "./Output.jsx";

export default function GeneratedOutput({ width, histDerived, demoMode }) {
  return (
    <div className={"h-full"}>
      <div className={"fixed top-4 right-4"} style={{zIndex: 99999}}>
        <MediumButton content={"💌 Share!"} onClick={e => addHist(histDerived)}></MediumButton>
      </div>
      <Output width={width} histDerived={histDerived} demoMode={demoMode}/>
    </div>
  );
}