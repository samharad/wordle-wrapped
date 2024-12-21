import {MediumButton} from "./commonComponents.jsx";
import {addHist} from "./instantDb.js";
import Output from "./Output.jsx";
import {useState} from "react";

export default function GeneratedOutput({ width, histDerived, demoMode }) {
  const [link, setLink] = useState(null);
  const handleClick = e => {
    addHist(histDerived)
      .then(([id]) =>{
        const link = `localhost:5173/share/${id}`;
        return navigator.clipboard.writeText(link).then(ignore => link);
      }).then(link => {
        setLink(link);
      });
  };
  return (
    <div className={"h-full"}>
      <div className={"fixed top-4 right-4"} style={{zIndex: 99999}}>
        <MediumButton content={link ? "🔗 Link copied!" : "💌 Share!"}
                      onClick={handleClick}></MediumButton>
      </div>
      <Output width={width} histDerived={histDerived} demoMode={demoMode}/>
    </div>
  );
}