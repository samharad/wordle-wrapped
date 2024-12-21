import {Link} from "react-router";
import {BigButton, SmallButton} from "./commonComponents.jsx";
import MessagesInstructions from "./MessagesInstructions.jsx";
import Accordion from "./Accordion.jsx";

const demoText = `Pauline:
\tWordle 1,027 4/6

🟨⬜⬜⬜🟩
⬜🟩⬜🟩🟩
⬜🟩🟩🟩🟩
🟩🟩🟩🟩🟩

Sam:
\tWordle 1,027 6/6

⬛⬛⬛⬛⬛
🟨⬛🟨⬛🟩
🟨⬛⬛🟩🟩
⬛🟩⬛🟩🟩
⬛🟩🟩🟩🟩
🟩🟩🟩🟩🟩

Mom:
\tWordle 1,028 3/6

⬜⬜⬜🟨🟩
🟨⬜⬜⬜🟩
🟩🟩🟩🟩🟩
`;

export default function Input({ rawHist, setRawHist, histDerived }) {

  function handleSubmit(e) {
    setRawHist(e.target.value);
  }

  const disableNext = histDerived.length === 0;

  return (
    <div>
      <div className={"flex flex-col"}>
        <div className="font-bold text-5xl p-3">Enter your Wordle chat history</div>
        <div className="italic text-white text-xl m-6 p-2 shrink rounded m-auto"
             style={{margin: "auto"}}>
          Tip: you may need to copy from your desktop client.
        </div>
        <div className={"text-3xl py-3"}>
          <div className={""}>
            <textarea id="chat"
                      className="bg-white text-dark-green p-2 rounded"
                      value={rawHist}
                      onChange={handleSubmit}
                      placeholder={"Paste here!"}
                      cols={18}
                      rows={6}
            >
            </textarea>
          </div>
        </div>

        <div className={"py-3"}>
          <BigButton content={<Link onClick={disableNext ? e => e.preventDefault() : undefined}
                                    to="/input-review">Continue</Link>}
                     disabled={disableNext}/>
        </div>

        <div className={"py-3"}>
          <Accordion
            whenOpenButton={setOpen =>
              <SmallButton content={"Close instructions"} onClick={e => setOpen(false)}/>}
            whenClosedButton={setOpen =>
              <SmallButton content={"Show instructions for Messages"} onClick={e => setOpen(true)}/>}
            content={<MessagesInstructions/>}/>
        </div>

        {/*<ol>*/}
        {/*  <li className="my-3">*/}
        {/*  </li>*/}

        {/*  <li className="my-3">*/}
        {/*  </li>*/}

        {/*<li className="my-3">*/}
        {/*  <div>*/}
        {/*    <label htmlFor="group-name">Enter a group name (optional):</label>*/}
        {/*  </div>*/}
        {/*  <div>*/}
        {/*    <input id="group-name" className="bg-white text-dark-green p-2 rounded" type="text"/>*/}
        {/*  </div>*/}
        {/*</li>*/}

        {/*</ol>*/}
      </div>
    </div>
  );
}