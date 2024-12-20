import {Link} from "react-router";

export function BigButton({ content, onClick, disabled }) {
  return disabled
    ? <button
        className="text-3xl bg-white text-red hover:bg-red hover:text-white font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded opacity-50 cursor-not-allowed">
        {content}
      </button>
    : <button
        className="text-3xl bg-white text-red hover:bg-red hover:text-white font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
        onClick={onClick}>
        {content}
      </button>;
}

export function SmallButton({ content, onClick, disabled }) {
  return disabled
    ? <button
      className="text-l bg-white text-dark-green hover:bg-dark-green hover:text-white font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded opacity-50 cursor-not-allowed">
      {content}
    </button>
    : <button
      className="text-l bg-white text-dark-green hover:bg-dark-green hover:text-white font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
      onClick={onClick}>
      {content}
    </button>;
}

export const Card = ({ title, subtitle, children }) => (
  <div className={"border rounded bg-white text-dark-green md:mx-40 py-3 px-2"}>
    <div className="text-4xl font-bold">{title}</div>
    <div>{subtitle}</div>
    <div className={"flex items-center"}>
      <hr align="center" className={"w-2/3 m-auto my-2"}/>
    </div>
    <div>
      {children}
    </div>
  </div>
);

export const InstructionText = ({ content }) => (
  <span className={"italic text-red"}>{content}</span>
);