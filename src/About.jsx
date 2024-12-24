import {Card} from "./commonComponents.jsx";
import {Link} from "react-router";

export default function About({ width }) {
  return (
    <div className={"h-full"}>
      <div className={"p-2 rounded h-full"}>
        <div className={"flex flex-col align-center justify-center content-center h-full"}>
          <Card title={"About"}>
            <div className={"py-1 px-4 text-xl"}>
              <div className={""}>
                Wordle Wrapped was made by <Link className={"text-red hover:font-bold"} to={"https://samadams.dev/"}>Sam Adams</Link> to
                entertain his family.
              </div>
              <div className={"pt-3"}>
                The source code is available <Link className={"text-red hover:font-bold"} to={"https://github.com/samharad/wordle-wrapped"}>here</Link>.
              </div>
              <div className={"py-3"}>
                Wordle Wrapped is not affiliated with <Link className={"text-red hover:font-bold"} to={"https://www.nytimes.com/games/wordle"}>Wordle</Link> or with <Link className={"text-red hover:font-bold"} to={"https://www.nytimes.com/"}>The New York Times</Link>.
              </div>
              <div>
                Please submit feedback to <Link className={"text-red hover:font-bold"} to={"mailto:sam.h.adams@gmail.com"}>sam.h.adams@gmail.com</Link>.
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}