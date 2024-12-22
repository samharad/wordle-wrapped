import {MediumButton} from "./commonComponents.jsx";
import {addHist, db} from "./instantDb.js";
import Output from "./Output.jsx";
import {useEffect, useState} from "react";
import {Link} from "react-router";

export default function GeneratedOutput({ width, histDerived, demoMode }) {
  const [shortId, setShortId] = useState(null);
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);
  const { isLoading, user, error } = db.useAuth();
  const [modalIsOpen, setIsOpen] = useState(false);

  const handleClick = e => {
    (shortId
      ? Promise.resolve([shortId])
      : addHist(histDerived, user.id))
      .then(([id]) => {
        const link = window.location.href.includes("localhost") ? `localhost:5173/share/${id}` : `wordlewrapped.com/share/${id}`;
        return navigator.clipboard.writeText(link).then(ignore => id);
      }).then(id=> {
      setShortId(id);
      setShowCopiedMessage(true);
      setTimeout(() => setShowCopiedMessage(false), 2000);
    });
  };

  let content;
  if (shortId && showCopiedMessage) {
    content = "🔗 Link copied!";
  } else if (user) {
    content = "💌 Share";
  } else {
    content = <Link to={"/login"}>💌 Share</Link>;
  }
  return (
    <div className={"h-full"}>
      <div className={"fixed top-4 right-4"} style={{zIndex: 99999}}>
        <MediumButton content={content}
                      onClick={user ? handleClick : undefined}></MediumButton>
      </div>
      <Output width={width} histDerived={histDerived} demoMode={demoMode}/>
    </div>
  );
}