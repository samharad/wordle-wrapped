import {Link} from "react-router";
import Output from "./Output.jsx";
import {placeHistDerived} from "./placeHistDerived.js";

export default function Home({ width }) {
  return (
    <div className={"h-full"}>
      <div className={"text-nowrap backdrop-blur-xl fixed top-1/2 left-1/2 inline-block p-2 rounded "}
           style={{
             transform: "translate(-50%, -50%)",
             zIndex: 9999,
      }}>
        <button
          className="text-3xl bg-white text-red hover:bg-red hover:text-white font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">
          <Link to="/input">🎁 Get Wrapping 🎁</Link>
        </button>
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