import {useParams, useSearchParams} from "react-router";
import Output from "./Output.jsx";
import {db} from "./instantDb.js";
import 'react-multi-carousel/lib/styles.css';
import {Spinner} from "./commonComponents.jsx";

export default function SharedOutput({ width }) {
  const [searchParams, setSearchParams] = useSearchParams();
  let params = useParams();
  const shortId = params.shortId;

  const query = {
    histories: {
      $: {
        where: {
          shortId: shortId,
        },
      },
    },
  };
  const { isLoading, error, data } = db.useQuery(query);

  if (error) {
    console.error(error);
    window.location.href = '/';
  }

  return (
    !data
      ? <div className={"h-full flex flex-col align-center justify-center content-center text-5xl"}><Spinner /></div>
      : <Output width={width} histDerived={data && data.histories[0] ? data.histories[0].hist : []}/>
  );
}

