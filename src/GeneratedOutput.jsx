import {MediumButton} from "./commonComponents.jsx";
import {addHist} from "./instantDb.js";
import Output from "./Output.jsx";
import {useState} from "react";

export default function GeneratedOutput({ width, histDerived, demoMode }) {
  const [shortId, setShortId] = useState(null);
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);

  const handleClick = e => {
    (shortId
      ? Promise.resolve([shortId])
      : addHist(histDerived))
      .then(([id]) =>{
        const link = `localhost:5173/share/${id}`;
        return navigator.clipboard.writeText(link).then(ignore => id);
      }).then(id=> {
      setShortId(id);
      setShowCopiedMessage(true);
      setTimeout(() => setShowCopiedMessage(false), 2000);
    });
  };
  return (
    <div className={"h-full"}>
      <div className={"fixed top-4 right-4"} style={{zIndex: 99999}}>
        <MediumButton content={shortId && showCopiedMessage ? "🔗 Link copied!" : "💌 Share"}
                      onClick={handleClick}></MediumButton>
      </div>
      <Output width={width} histDerived={histDerived} demoMode={demoMode}/>
    </div>
  );
}