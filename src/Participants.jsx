import {Card, InstructionText} from "./commonComponents.jsx";

export default function Participants({ hist, names, setNames }) {
  const ps = [...new Set(hist.map(x => x.person))];
  const nameChangeHandler = p => e => {
    setNames({ ...names, [p]: e.target.value });
  }
  return (
    <Card title={"💁 Players"}
          subtitle={<div className={"text-lg "}>
                      <div>
                        <InstructionText content={"Optional: fix up names and enter aliases."}/>
                      </div>
                      <div>
                        <InstructionText content={"If a player used multiple contacts (e.g. phone and email), give each contact the same alias."}/>
                      </div>
                    </div>}
    >
      <table className={"table-auto m-auto"}>
        <tbody>
        {ps.map((p, i) =>
            <tr key={i}>
              <td className={"p-1 px-5 text-left"}>{p}</td>
              <td className={"p-1 px-5 text-left"}>
                <input defaultValue={names[p] || p}
                       onChange={nameChangeHandler(p)}
                className={"p-1 rounded"}/>
              </td>
            </tr>)}
        </tbody>
      </table>
    </Card>
  );
}