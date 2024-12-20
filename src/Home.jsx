import {Link} from "react-router";
import Output from "./Output.jsx";
import {placeHistDerived} from "./placeHistDerived.js";
import {BigButton} from "./commonComponents.jsx";

export default function Home({ width }) {
  return (
    <div className={"h-full"}>
      <div className={"text-nowrap backdrop-blur-xl fixed top-1/2 left-1/2 inline-block p-2 rounded "}
           style={{
             transform: "translate(-50%, -50%)",
             zIndex: 9999,
      }}>
        <BigButton content={<Link to="/input">🎁 Get Wrapping 🎁</Link>} />
      </div>
      <div className={"opacity-50 h-full pointer-events-none"}>
        <Output width={width}
                histDerived={placeHistDerived}
                demoMode={true}
        />
      </div>
    </div>
  );
}