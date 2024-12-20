import {Link} from "react-router";

export function BigButton({ content }) {
  return (
    <button
      className="text-3xl bg-white text-red hover:bg-red hover:text-white font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">
      <Link to="/input">{content}</Link>
    </button>
  );
}