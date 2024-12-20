import {useSearchParams} from "react-router";
import Output from "./Output.jsx";
import {db} from "./instantDb.js";
import 'react-multi-carousel/lib/styles.css';

export default function SharedOutput({ width }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const histId = searchParams.get('histId');

  const query = {
    histories: {
      $: {
        where: {
          id: histId,
        },
      },
    },
  };
  const { isLoading, error, data } = db.useQuery(query);

  if (error) {
    console.error(error);
  }
  console.log(data);

  return (
    <Output width={width} histDerived={data && data.histories[0] ? data.histories[0].hist : []}/>
  );
}

